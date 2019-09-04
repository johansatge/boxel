const fs = require('fs')
const path = require('path')

const m = {}
module.exports = m

const statePath = path.join(__dirname, '../.state.json')

m.setState = (mode, stateData) => {
  return new Promise((resolve, reject) => {
    const state = {
      mode,
      data: stateData,
    }
    fs.writeFile(statePath, JSON.stringify(state), 'utf8', (error) => {
      error ? reject(error) : resolve(state)
    })
  })
}

m.getState = ({ defaultMode }) => {
  return new Promise((resolve, reject) => {
    fs.readFile(statePath, 'utf8', (error, contents) => {
      if (error) {
        return {
          mode: defaultMode,
          data: {},
        }
      }
      const state = JSON.parse(contents)
      resolve(state)
    })
  })
}
