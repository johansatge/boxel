const express = require('express')
const log = require('./helpers/log.js')
const path = require('path')
const pkg = require('./package.json')
const { getState, setState } = require('./helpers/state.js')

require('dotenv').config()

const app = express()
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '.'))

const modes = [
  require('./modes/idle/index.js'),
  require('./modes/white/index.js'),
  require('./modes/random/index.js'),
  require('./modes/logo/index.js'),
  require('./modes/netatmo/index.js'),
]
let currentMode = null

const LedMatrix = require('node-rpi-rgb-led-matrix')
const matrix = new LedMatrix(32)

function setCurrentMode(mode) {
  if (currentMode) {
    log('Stopping mode ' + currentMode.getId())
    currentMode.stop(matrix)
  }
  currentMode = mode
  log('Starting mode ' + currentMode.getId())
  currentMode.start(matrix)
  setState(currentMode.getId(), {})
}

app.get('/', (request, response) => {
  response.status(200).render('modes', {viewTitle: pkg.name, modes, currentMode})
})

app.get('/setmode/:id', (request, response) => {
  const mode = modes.find((mode) => mode.getId() === request.params.id)
  if (mode) {
    setCurrentMode(mode)
    response.redirect(302, '/')
  }
  else {
    response.status(500).send('Mode not found')
  }
})

app.get('/setstate', (request, response) => {
  if (typeof currentMode.setState !== 'function') {
    return response.status(500).json({status: 'ko', error: 'No state listener for this mode'})
  }
  currentMode.setState(request.query)
    .then((stateData) => {
      setState(currentMode.getId(), stateData || {})
      response.status(200).json({status: 'ok', response: stateData || {}})
    })
    .catch((error) => {
      response.status(500).json({status: 'ko', error: error.message})
    })
})

const port = 3030
app.listen(port, function () {
  log(`Listening on port ${port}`)
  getState(modes[0].getId()).then((state) => {
    const targetMode = modes.find((mode) => mode.getId() === state.mode)
    setCurrentMode(targetMode)
  })
})
