const { loadModes } = require('./helpers/modes.js')
const { startServer } = require('./helpers/server.js')

const port = 3030

loadModes().then(() => {
  startServer({ port })
})
