const fs = require('fs').promises
const { log } = require('./log.js')
const path = require('path')

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
        cachedModes[entry.name] = require(path.join(__dirname, '../modes', entry.name, '/index.js'))
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
        currentModeId: isValidMode(diskState.currentModeId) ? diskState.currentModeId : 'clock',
        modesData: diskState.modesData,
      }
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
  m.startCurrentMode()
}

m.applyCurrentModeAction = (action, rawData) => {
  const updatedModeData = cachedModes[cachedRunningModeId].applyModeAction(action, rawData)
  cachedState.modesData[cachedState.currentModeId] = updatedModeData
  log(`Saved current mode data (${JSON.stringify(updatedModeData)})`)
  writeState()
}

m.getCurrentModeId = () => {
  return cachedState.currentModeId
}

m.getCurrentModeData = () => {
  return cachedState.modesData[cachedState.currentModeId] || {}
}

m.startCurrentMode = () => {
  if (cachedRunningModeId !== null) {
    cachedModes[cachedRunningModeId].stopMode()
    log(`Stopped mode ${cachedRunningModeId}`)
  }
  const initialData = cachedModes[cachedState.currentModeId].startMode(m.getCurrentModeData())
  cachedState.modesData[cachedState.currentModeId] = initialData
  log(`Started mode ${cachedState.currentModeId}`)
  cachedRunningModeId = cachedState.currentModeId
  writeState()
}

const isValidMode = (modeId) => {
  return typeof modeId === 'string' && typeof cachedModes[modeId] === 'object'
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
