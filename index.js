const { loadModes, startMode } = require('./helpers/modes.js')
const { startServer } = require('./helpers/server.js')
const { getState } = require('./helpers/state.js')
const { initMatrix } = require('./helpers/matrix.js')

const port = 3030

;(async () => {
  try {
    await initMatrix()
    await loadModes()
    const state = await getState()
    await startMode(state.currentMode)
    await startServer({ port })
  }
  catch(error) {
    console.log(`Could not start app (${error.message})`)
  }
})()
