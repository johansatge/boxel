const fs = require('fs')
const path = require('path')

const m = {}
module.exports = m

let cachedModes = null

m.getDefaultMode = function() {
  return 'idle'
}

m.getAvailableModes = function() {
  if (cachedModes !== null) {
    return Promise.resolve(cachedModes)
  }
  cachedModes = {}
  return new Promise((resolve, reject) => {
    fs.readdir(path.join(__dirname, '../modes'), { withFileTypes: true }, (error, list) => {
      if (error) {
        return reject(error)
      }
      list.filter((entry) => entry.isDirectory() && !entry.name.match(/^\./)).forEach((entry) => {
        const modeModule = require(path.join(__dirname, '../modes', entry.name, '/index.js'))
        cachedModes[entry.name] = modeModule
      })
      resolve(cachedModes)
    })
  })
}

m.isValidMode = function(modeId) {
  return typeof modeId === 'string' && cachedModes[modeId]
}
