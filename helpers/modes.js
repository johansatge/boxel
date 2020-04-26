const fs = require('fs')
const path = require('path')
const { log } = require('./log.js')
const { isDryRun } = require('./system.js')
const { getCurrentModeId, getCurrentModeData } = require('./state.js')

const m = {}
module.exports = m

let cachedModes = {}
let cachedCurrentModeId = null

m.getDefaultModeId = () => {
  return 'idle'
}

m.startCurrentMode = () => {
  if (isDryRun()) {
    log(`Ignoring start mode ${getCurrentModeId()}`)
    return
  }
  if (cachedCurrentModeId !== null) {
    log(`Stopping mode ${cachedCurrentModeId}`)
    cachedModes[cachedCurrentModeId].stop()
  }
  log(`Starting mode ${getCurrentModeId()}`)
  cachedModes[getCurrentModeId()].start(getCurrentModeData())
  cachedCurrentModeId = getCurrentModeId()
}

m.updateCurrentMode = () => {
  if (isDryRun()) {
    log(`Ignoring update mode ${getCurrentModeId()}`)
    return
  }
  cachedModes[cachedCurrentModeId].update(getCurrentModeData())
}

m.loadModes = () => {
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

m.getAvailableModes = () => {
  return cachedModes
}

m.isValidMode = (modeId) => {
  return typeof modeId === 'string' && cachedModes[modeId]
}
