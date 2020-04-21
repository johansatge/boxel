const fs = require('fs')
const path = require('path')

const m = {}
module.exports = m

let cachedModules = []
let cachedModulesNames = []

m.getDefaultMode = function() {
  return 'idle'
}

m.getAvailableModes = function() {
  if (cachedModules.length > 0) {
    return Promise.resolve(cachedModules)
  }
  return new Promise((resolve, reject) => {
    fs.readdir(path.join(__dirname, '../modes'), { withFileTypes: true }, (error, list) => {
      if (error) {
        return reject(error)
      }
      list.filter((entry) => entry.isDirectory() && !entry.name.match(/^\./)).forEach((entry) => {
        const modeModule = require(path.join(__dirname, '../modes', entry.name, '/index.js'))
        cachedModules.push(modeModule)
        cachedModulesNames.push(entry.name)
      })
      resolve(cachedModules)
    })
  })
}

m.isValidMode = function(modeId) {
  return typeof modeId === 'string' && cachedModulesNames.includes(modeId)
}
