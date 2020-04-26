const { log } = require('./helpers/log.js')
const { startServer } = require('./helpers/server.js')
const { loadMatrix } = require('./helpers/matrix.js')
const { loadState, loadModesAndStart, startCurrentMode } = require('./helpers/state.js')

;(async () => {
  try {
    await loadState()
    await loadMatrix()
    await loadModesAndStart()
    startServer()
  }
  catch(error) {
    log(`Could not start app (${error.message})`)
  }
})()
