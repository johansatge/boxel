const fs = require('fs')
const path = require('path')
const { log } = require('./log.js')
const { isDryRun } = require('./system.js')
const { getCurrentModeId, getCurrentModeData } = require('./state.js')

const m = {}
module.exports = m

let cachedModes = {}
let currentStartedModeId = null

m.getDefaultModeId = function() {
  return 'idle'
}

m.startCurrentMode = function() {
  if (isDryRun()) {
    log(`Ignoring start mode ${getCurrentModeId()}`)
    return
  }
  if (currentStartedModeId !== null) {
    log(`Stopping mode ${currentStartedModeId}`)
    cachedModes[currentStartedModeId].stop()
  }
  log(`Starting mode ${getCurrentModeId()}`)
  cachedModes[getCurrentModeId()].start(getCurrentModeData())
  currentStartedModeId = getCurrentModeId()
}

m.updateCurrentMode = function() {
  if (isDryRun()) {
    log(`Ignoring update mode ${getCurrentModeId()}`)
    return
  }
  cachedModes[currentStartedModeId].update(getCurrentModeData())
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
