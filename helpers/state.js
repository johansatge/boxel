const fs = require('fs').promises
const { log } = require('./log.js')
const path = require('path')
const { getDefaultMode } = require('./modes.js')

const m = {}
module.exports = m

const statePath = path.join(__dirname, '../.state.json')

m.setState = ({ currentMode, stateData }) => {
  const state = {
    currentMode,
    data: stateData,
  }
  return fs.writeFile(statePath, JSON.stringify(state, null, 2), 'utf8').then(() => state)
}

m.getState = () => {
  return fs.readFile(statePath, 'utf8')
    .then((contents) => JSON.parse(contents))
    .catch((error) => {
      log(`Could not read state, defaulting to ${getDefaultMode()} (${error.message})`)
      return {
        currentMode: getDefaultMode(),
        data: {},
      }
    })
}
