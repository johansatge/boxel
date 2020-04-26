const fs = require('fs').promises
const { log } = require('./log.js')
const path = require('path')
const { isDryRun } = require('./system.js')

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

m.isValidMode = (modeId) => {
  return typeof modeId === 'string' && cachedModes[modeId]
}

m.loadState = () => {
  return fs.readFile(statePath, 'utf8')
    .then((contents) => {
      cachedState = JSON.parse(contents) // @todo sanitize data (current mode & data)
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
  cachedState.currentModeId = modeId
  writeState()
  log(`Set current mode ${modeId}`)
  startCurrentMode()
}

m.setStateCurrentModeData = (data) => {
  cachedState.modesData[cachedState.currentModeId] = data
  log(`Saved current mode data (${JSON.stringify(data)})`)
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
