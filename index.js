const { loadModes, startCurrentMode } = require('./helpers/modes.js')
const { startServer } = require('./helpers/server.js')
const { loadMatrix } = require('./helpers/matrix.js')
const { loadState } = require('./helpers/state.js')

;(async () => {
  try {
    await loadState()
    await loadMatrix()
    await loadModes()
    startCurrentMode()
    startServer()
  }
  catch(error) {
    console.log(`Could not start app (${error.message})`)
  }
})()
