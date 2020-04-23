const express = require('express')
const { log } = require('./log.js')
const { getAvailableModes, getDefaultMode, isValidMode } = require('./modes.js')
const {
  registerSseClient,
  sendSseEventToClient,
  sendSseEventToClients,
  startSsePing,
} = require('./sse.js')
const path = require('path')
const pkg = require('../package.json')
const { getState, setState } = require('./state.js')
const { requestShutdown, isDryRun } = require('./system.js')

const m = {}
module.exports = m

m.startServer = function({ port }) {
  const app = express()
  app.set('view engine', 'ejs')
  app.set('views', path.join(__dirname, '..'))

  app.get('/', responseHome)
  app.get('/shutdown', responseShutdown)
  app.get('/setcurrentmode/:mode', responseSetCurrentMode)
  app.get('/setmodedata/:mode/:data', responseSetModeData)
  app.get('/sse', responseSse)
  app.get('/viewstate', responseViewState)
  app.use('/static', express.static(path.join(__dirname, '../static')))

  app.listen(port, function () {
    log(`Server started on http://localhost:${port} (${isDryRun() ? 'DRY' : 'LIVE'})`)
    startSsePing()
  })
}

function responseHome(request, response) {
  const modes = getAvailableModes()
  response.status(200).render('index', { viewTitle: pkg.name, modes })
}

function responseSetCurrentMode(request, response) {
  getState()
    .then((state) => {
      if (!isValidMode(request.params.mode)) {
        throw new Error('Unknown mode')
      }
      return setState({ currentMode: request.params.mode, stateData: state.data })
    })
    .then((state) => {
      sendSseEventToClients({ eventName: 'stateUpdate', data: state })
      response.status(200).json({ error: null })
    })
    .catch((error) => {
      response.status(500).json({ error: error.message })
    })
}

function responseSetModeData(request, response) {
  getState()
    .then((state) => {
      const mode = request.params.mode
      if (!isValidMode(mode)) {
        throw new Error('Unknown mode')
      }
      const data = JSON.parse(request.params.data) // @todo sanitize and process data through the right mode
      state.data[mode] = data
      return setState({ currentMode: state.currentMode, stateData: state.data })
    })
    .then((state) => {
      sendSseEventToClients({ eventName: 'stateUpdate', data: state })
      response.status(200).json({ error: null })
    })
    .catch((error) => {
      response.status(500).json({ error: error.message })
    })
}

function responseShutdown(request, response) {
  requestShutdown()
  response.status(200).json({ error: null })
}

function responseViewState(request, response) {
  getState()
    .then((state) => {
      response.status(200).json(state)
    })
    .catch((error) => {
      response.status(500).send(error.message)
    })
}

function responseSse(request, response) {
  const clientId = registerSseClient({ request, response })
  getState().then((state) => {
    sendSseEventToClient({ clientId, eventName: 'stateUpdate', data: state })
  })
}

