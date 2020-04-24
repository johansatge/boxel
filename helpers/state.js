const fs = require('fs').promises
const { log } = require('./log.js')
const path = require('path')

const m = {}
module.exports = m

const statePath = path.join(__dirname, '../.state.json')

let cachedState = null

m.loadState = () => {
  return fs.readFile(statePath, 'utf8')
    .then((contents) => {
      cachedState = JSON.parse(contents)
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
}

m.setStateCurrentModeData = (data) => {
  cachedState.modesData[cachedState.currentModeId] = data
  writeState()
}

m.getCurrentModeId = () => {
  return cachedState.currentModeId
}

m.getCurrentModeData = () => {
  return cachedState.modesData[cachedState.currentModeId] || {}
}

function writeState() {
  fs.writeFile(statePath, JSON.stringify(cachedState, null, 2), 'utf8')
    .then(() => {
      log('Wrote state to disk')
    })
    .catch((error) => {
      log(`Could not write state to disk (${error.message})`)
    })
}
