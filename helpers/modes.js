const fs = require('fs')
const path = require('path')

const m = {}
module.exports = m

let cachedModules = null

m.getDefaultMode = function() {
  return 'idle'
}

m.getAvailableModes = function() {
  if (cachedModules !== null) {
    return Promise.resolve(cachedModules)
  }
  return new Promise((resolve, reject) => {
    fs.readdir(path.join(__dirname, '../modes'), { withFileTypes: true }, (error, list) => {
      if (error) {
        return reject(error)
      }
      cachedModules = list
        .filter((entry) => entry.isDirectory() && !entry.name.match(/^\./))
        .map((entry) => require(path.join(__dirname, '../modes', entry.name, '/index.js')))
      resolve(cachedModules)
    })
  })
}
