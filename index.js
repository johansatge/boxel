const express = require('express')
const log = require('./log.js')
const path = require('path')
const pkg = require('./package.json')

const app = express()
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '.'))

const modes = [
  require('./modes/idle.js'),
  require('./modes/white.js'),
  require('./modes/random.js'),
  require('./modes/logo.js'),
]
let currentMode = null

function setCurrentMode(mode) {
  if (currentMode) {
    log('Stopping mode ' + currentMode.getId())
    currentMode.stop()
  }
  currentMode = mode
  log('Starting mode ' + currentMode.getId())
  currentMode.start()
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

const port = 3030
app.listen(port, function () {
  log(`Listening on port ${port}`)
  setCurrentMode(modes[0])
})
