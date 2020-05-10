const express = require('express')
const { log, getLogs } = require('./log.js')
const {
  registerSseClient,
  sendSseEventToClients,
  startSsePing,
} = require('./sse.js')
const path = require('path')
const pkg = require('../package.json')
const {
  getAvailableModes,
  getStateAsJson,
  getCurrentModeId,
  getCurrentModeData,
  setStateCurrentModeId,
  applyCurrentModeAction,
} = require('./state.js')
const { requestShutdown, isDryRun, getUrls, getPort } = require('./system.js')

const m = {}
module.exports = m

m.startServer = () => {
  const app = express()
  app.set('view engine', 'ejs')
  app.set('views', path.join(__dirname, '..'))
  app.use(express.json({
    limit: '800kb',
  }))

  app.get('/', responseHome)
  app.post('/shutdown', responseShutdown)
  app.post('/setcurrentmode', responseSetCurrentMode)
  app.post('/applycurrentmodeaction', responseApplyCurrentModeAction)
  app.get('/sse', responseSse)
  app.get('/viewstate', responseViewState)
  app.get('/viewlogs', responseViewLogs)
  app.use('/static', express.static(path.join(__dirname, '../static')))

  app.listen(getPort(), () => {
    log(`Server started (${isDryRun() ? 'DRY' : 'LIVE'}) (${getUrls().join(', ')})`)
    startSsePing()
  })
}

const responseHome = (request, response) => {
  const modes = getAvailableModes()
  response.status(200).render('index', {
    viewTitle: `${pkg.name}${isDryRun() ? ' (DRY RUN)' : ''}`,
    modes
  })
}

const responseSetCurrentMode = (request, response) => {
  try {
    setStateCurrentModeId(request.body.mode)
    sendStateUpdateToClients()
    response.status(200).json({ error: null })
  }
  catch(error) {
    response.status(500).json({ error: error.message })
  }
}

const responseApplyCurrentModeAction = (request, response) => {
  try {
    applyCurrentModeAction(request.body.action, request.body.data)
    sendStateUpdateToClients()
    response.status(200).json({ error: null })
  }
  catch(error) {
    response.status(500).json({ error: error.message })
  }
}

const responseShutdown = (request, response) => {
  requestShutdown()
  response.status(200).json({ error: null })
}

const responseViewState = (request, response) => {
  response.status(200).type('application/json').send(getStateAsJson())
}

const responseViewLogs = (request, response) => {
  response.status(200).type('text/plain').send(getLogs())
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

