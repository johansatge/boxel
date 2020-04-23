const fs = require('fs').promises
const { log } = require('./log.js')
const path = require('path')
const { getDefaultModeId, isValidMode } = require('./modes.js')

const m = {}
module.exports = m

const statePath = path.join(__dirname, '../.state.json')

m.setStateCurrentMode = (mode) => {
  if (!isValidMode(mode)) {
    return Promise.reject(new Error('Invalid mode'))
  }
  return m.getState().then((state) => writeState({
    currentMode: mode,
    data: state.data,
  }))
}

m.setStateModeData = ({ mode, data }) => {
  if (!isValidMode(mode)) {
    return Promise.reject(new Error('Invalid mode'))
  }
  return m.getState().then((state) => {
    state.data[mode] = data
    return writeState(state)
  })
}

function writeState(state) {
  return fs.writeFile(statePath, JSON.stringify(state, null, 2), 'utf8').then(() => state)
}

m.getState = () => {
  return fs.readFile(statePath, 'utf8')
    .then((contents) => JSON.parse(contents))
    .catch((error) => {
      log(`Could not read state, defaulting to ${getDefaultModeId()} (${error.message})`)
      return {
        currentMode: getDefaultModeId(),
        data: {},
      }
    })
}
