const express = require('express')
const log = require('./log.js')
const path = require('path')
const pkg = require('./package.json')

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

app.get('/doaction', (request, response) => {
  if (typeof currentMode.doAction !== 'function') {
    return response.status(500).json({status: 'ko', error: 'No action listener for this mode'})
  }
  currentMode.doAction(request.query)
    .then((actionData) => {
      response.status(200).json({status: 'ok', response: actionData})
    })
    .catch((error) => {
      response.status(500).json({status: 'ko', error: error.message})
    })
})

const port = 3030
app.listen(port, function () {
  log(`Listening on port ${port}`)
  setCurrentMode(modes[0])
})
