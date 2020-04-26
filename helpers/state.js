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

m.loadModesAndStart = () => {
  return fs.readdir(path.join(__dirname, '../modes'), { withFileTypes: true })
    .then((list) => {
      cachedModes = {}
      list.filter((entry) => entry.isDirectory() && !entry.name.match(/^\./)).forEach((entry) => {
        const modeModule = require(path.join(__dirname, '../modes', entry.name, '/index.js'))
        cachedModes[entry.name] = modeModule
      })
      log(`Loaded modes ${Object.keys(cachedModes).join(', ')}`)
      startCurrentMode()
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

m.loadState = () => {
  return fs.readFile(statePath, 'utf8')
    .then((contents) => {
      cachedState = JSON.parse(contents) // @todo sanitize data (current mode at least)
      log('Loaded state')
    })
    .catch((error) => {
      cachedState = {
        currentModeId: 'idle',
        modesData: {},
      }
      log(`Could not read state, defaulted (${error.message})`)
    })
}

m.getStateAsJson = () => {
  return JSON.stringify(cachedState, null, 2)
}

m.setStateCurrentModeId = (modeId) => {
  if (typeof modeId !== 'string' || !cachedModes[modeId]) {
    throw new Error('Invalid mode ID')
  }
  cachedState.currentModeId = modeId
  writeState()
  log(`Set current mode ${modeId}`)
  startCurrentMode()
}

m.setStateCurrentModeData = (rawData) => {
  if (typeof rawData !== 'object') {
    throw new Error('Data is not an object')
  }
  const modeDataSchema = cachedModes[cachedState.currentModeId].getDataSchema()
  const dataValidation = new Validator().validate(rawData, modeDataSchema)
  if (!dataValidation.valid) {
    const errors = dataValidation.errors.map((error) => error.stack)
    throw new Error(`Invalid data for current mode (${errors.join(', ')})`)
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

const startCurrentMode = () => {
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

const writeState = () => {
  fs.writeFile(statePath, JSON.stringify(cachedState, null, 2), 'utf8')
    .then(() => {
      log('Wrote state to disk')
    })
    .catch((error) => {
      log(`Could not write state to disk (${error.message})`)
    })
}
