const { log } = require('./helpers/log.js')
const { startServer } = require('./helpers/server.js')
const { loadMatrix } = require('./helpers/matrix.js')
const { loadStateFromDisk, loadModesFromDisk, startCurrentMode } = require('./helpers/state.js')

;(async () => {
  try {
    await loadModesFromDisk()
    await loadStateFromDisk()
    await loadMatrix()
    startCurrentMode()
    startServer()
  }
  catch(error) {
    log(`Could not start app (${error.message})`)
  }
})()
