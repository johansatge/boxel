const fs = require('fs').promises
const { log } = require('./log.js')
const path = require('path')
const { isDryRun } = require('./system.js')
const { Validator } = require('jsonschema')

const m = {}
module.exports = m

const statePath = path.join(__dirname, '../.state.json')

let cachedState = null
let cachedModes = null
let cachedRunningModeId = null

m.loadModesFromDisk = () => {
  return fs.readdir(path.join(__dirname, '../modes'), { withFileTypes: true })
    .then((list) => {
      cachedModes = {}
      list.filter((entry) => entry.isDirectory() && !entry.name.match(/^\./)).forEach((entry) => {
        const modeModule = require(path.join(__dirname, '../modes', entry.name, '/index.js'))
        cachedModes[entry.name] = modeModule
      })
      log(`Loaded modes ${Object.keys(cachedModes).join(', ')}`)
    })
}

m.getAvailableModes = () => {
  return Object.keys(cachedModes).map((modeId) => {
    return {
      id: modeId,
      title: cachedModes[modeId].getTitle(),
      description: cachedModes[modeId].getDescription(),
    }
  })
}

m.loadStateFromDisk = () => {
  return fs.readFile(statePath, 'utf8')
    .then((contents) => JSON.parse(contents))
    .catch((error) => {
      log(`Could not read state, defaulted (${error.message})`)
      return {}
    })
    .then((diskState) => {
      cachedState = {
        currentModeId: isValidMode(diskState.currentModeId) ? diskState.currentModeId : 'idle',
        modesData: {},
      }
      const diskModesData = typeof diskState.modesData === 'object' ? diskState.modesData : {}
      Object.keys(cachedModes).forEach((modeId) => {
        const diskData = diskModesData[modeId] || null
        const defaultData = cachedModes[modeId].getDefaultData()
        cachedState.modesData[modeId] = getModeDataErrors(modeId, diskData).length === 0 ? diskData : defaultData
      })
      log(`Loaded state: ${m.getStateAsJson()}`)
    })
}

m.getStateAsJson = () => {
  return JSON.stringify(cachedState, null, 2)
}

m.setStateCurrentModeId = (modeId) => {
  if (!isValidMode(modeId)) {
    throw new Error('Invalid mode ID')
  }
  cachedState.currentModeId = modeId
  writeState()
  log(`Set current mode ${modeId}`)
  m.startCurrentMode()
}

m.setStateCurrentModeData = (rawData) => {
  if (typeof rawData !== 'object') {
    throw new Error('Data is not an object')
  }
  const dataErrors = getModeDataErrors(cachedState.currentModeId, rawData)
  if (dataErrors.length > 0) {
    throw new Error(`Invalid data for current mode (${dataErrors.join(', ')})`)
  }
  cachedState.modesData[cachedState.currentModeId] = rawData
  log(`Saved current mode data (${JSON.stringify(rawData)})`)
  writeState()
  if (isDryRun()) {
    log(`Ignored update mode ${cachedState.currentModeId}`)
    return
  }
  cachedModes[cachedRunningModeId].update(m.getCurrentModeData())
}

m.getCurrentModeId = () => {
  return cachedState.currentModeId
}

m.getCurrentModeData = () => {
  return cachedState.modesData[cachedState.currentModeId] || {}
}

m.startCurrentMode = () => {
  if (isDryRun()) {
    log(`Ignored start mode ${cachedState.currentModeId}`)
    return
  }
  if (cachedRunningModeId !== null) {
    cachedModes[cachedRunningModeId].stop()
    log(`Stopped mode ${cachedRunningModeId}`)
  }
  cachedModes[cachedState.currentModeId].start(m.getCurrentModeData())
  log(`Started mode ${cachedState.currentModeId}`)
  cachedRunningModeId = cachedState.currentModeId
}

const isValidMode = (modeId) => {
  return typeof modeId === 'string' && typeof cachedModes[modeId] === 'object'
}

const getModeDataErrors = (modeId, rawData) => {
  const schema = cachedModes[modeId].getDataSchema()
  const validation = new Validator().validate(rawData, schema)
  return validation.valid ? [] : validation.errors.map((error) => error.stack)
}

const writeState = () => {
  fs.writeFile(statePath, JSON.stringify(cachedState, null, 2), 'utf8')
    .then(() => {
      log('Wrote state to disk')
    })
    .catch((error) => {
      log(`Could not write state to disk (${error.message})`)
    })
}
