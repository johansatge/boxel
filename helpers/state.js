const fs = require('fs')
const { log } = require('./log.js')
const path = require('path')

const m = {}
module.exports = m

const statePath = path.join(__dirname, '../.state.json')

m.setState = ({ currentMode, stateData }) => {
  return new Promise((resolve, reject) => {
    const state = {
      currentMode,
      data: stateData,
    }
    fs.writeFile(statePath, JSON.stringify(state, null, 2), 'utf8', (error) => {
      error ? reject(error) : resolve(state)
    })
  })
}

m.getState = ({ defaultMode }) => {
  return new Promise((resolve, reject) => {
    fs.readFile(statePath, 'utf8', (error, contents) => {
      if (!error) {
        const state = JSON.parse(contents)
        resolve(state)
      }
      else {
        log(`Could not read state, defaulting to ${defaultMode} (${error.message})`)
        resolve({
          currentMode: defaultMode,
          data: {},
        })
      }
    })
  })
}
