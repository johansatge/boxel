const express = require('express')
const { log } = require('./log.js')
const {
  getAvailableModes,
  isValidMode,
  startCurrentMode,
  updateCurrentMode,
} = require('./modes.js')
const {
  registerSseClient,
  sendSseEventToClients,
  startSsePing,
} = require('./sse.js')
const path = require('path')
const pkg = require('../package.json')
const {
  getStateAsJson,
  getCurrentModeId,
  getCurrentModeData,
  setStateCurrentModeId,
  setStateCurrentModeData,
} = require('./state.js')
const { requestShutdown, isDryRun, getUrls, getPort } = require('./system.js')

const m = {}
module.exports = m

m.startServer = () => {
  const app = express()
  app.set('view engine', 'ejs')
  app.set('views', path.join(__dirname, '..'))

  app.get('/', responseHome)
  app.get('/shutdown', responseShutdown)
  app.get('/setcurrentmode/:mode', responseSetCurrentMode)
  app.get('/setcurrentmodedata/:data', responseSetCurrentModeData)
  app.get('/sse', responseSse)
  app.get('/viewstate', responseViewState)
  app.use('/static', express.static(path.join(__dirname, '../static')))

  app.listen(getPort(), () => {
    log(`Server started (${isDryRun() ? 'DRY' : 'LIVE'}) (${getUrls().join(', ')})`)
    startSsePing()
  })
}

const responseHome = (request, response) => {
  const modes = getAvailableModes()
  response.status(200).render('index', { viewTitle: pkg.name, modes })
}

const responseSetCurrentMode = (request, response) => {
  if (!isValidMode(request.params.mode)) {
    response.status(500).json({ error: error.message })
  }
  setStateCurrentModeId(request.params.mode)
  startCurrentMode()
  sendStateUpdateToClients()
  response.status(200).json({ error: null })
}

const responseSetCurrentModeData = (request, response) => {
  // @todo sanitize and process data through the current mode
  setStateCurrentModeData(JSON.parse(request.params.data))
  updateCurrentMode()
  sendStateUpdateToClients()
  response.status(200).json({ error: null })
}

const responseShutdown = (request, response) => {
  requestShutdown()
  response.status(200).json({ error: null })
}

const responseViewState = (request, response) => {
  response.status(200).type('application/json').send(getStateAsJson())
}

const responseSse = (request, response) => {
  const clientId = registerSseClient({ request, response })
  sendStateUpdateToClients(clientId)
}

const sendStateUpdateToClients = (clientId = null) => {
  const data = {
    currentModeId: getCurrentModeId(),
    currentModeData: getCurrentModeData()
  }
  sendSseEventToClients({ clientId, eventName: 'stateUpdate', data })
}

