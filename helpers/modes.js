const fs = require('fs')
const path = require('path')
const { log } = require('./log.js')

const m = {}
module.exports = m

let cachedModes = {}

m.getDefaultMode = function() {
  return 'idle'
}

m.loadModes = function() {
  return new Promise((resolve, reject) => {
    fs.readdir(path.join(__dirname, '../modes'), { withFileTypes: true }, (error, list) => {
      if (error) {
        return reject(error)
      }
      list.filter((entry) => entry.isDirectory() && !entry.name.match(/^\./)).forEach((entry) => {
        const modeModule = require(path.join(__dirname, '../modes', entry.name, '/index.js'))
        cachedModes[entry.name] = modeModule
      })
      log(`Loaded modes ${Object.keys(cachedModes).join(', ')}`)
      resolve(cachedModes)
    })
  })
}

m.getAvailableModes = function() {
  return cachedModes
}

m.isValidMode = function(modeId) {
  return typeof modeId === 'string' && cachedModes[modeId]
}
