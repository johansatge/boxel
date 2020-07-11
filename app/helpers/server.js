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

/**
 * (GET)
 * Display the main UI (header, available modes)
 * Note at this point the UI is not dynamic yet
 * (its state is fetched by the client when it connects through SSE)
 *
 * @param {Object} request - Express HTTP request
 * @param {Object} response - Express HTTP response
 * @return {undefined}
 */
const responseHome = (request, response) => {
  const modes = getAvailableModes()
  response.status(200).render('index', {
    viewTitle: `${pkg.name}${isDryRun() ? ' (DRY RUN)' : ''}`,
    modes
  })
}

/**
 * (POST)
 * Set the current mode when a user clicks on a "set" button in the UI
 * Then, send the updated state to all the connected SSE clients
 *
 * @param {Object} request - Express HTTP request
 * @param {Object} response - Express HTTP response
 * @return {undefined}
 */
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

/**
 * (POST)
 * Apply an action to the current mode when the user interacts with the UI
 * Then, send the updated state to all the connected SSE clients
 *
 * @param {Object} request - Express HTTP request
 * @param {Object} response - Express HTTP response
 * @return {undefined}
 */
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

/**
 * (POST)
 * Try to shutdown the device when a user clicks on the "Shutdown" button in the UI, and confirms
 *
 * @param {Object} request - Express HTTP request
 * @param {Object} response - Express HTTP response
 * @return {undefined}
 */
const responseShutdown = (request, response) => {
  requestShutdown()
  response.status(200).json({ error: null })
}

/**
 * (GET)
 * Return the state as a JSON object (to be displayed properly by the browser)
 *
 * @param {Object} request - Express HTTP request
 * @param {Object} response - Express HTTP response
 * @return {undefined}
 */
const responseViewState = (request, response) => {
  response.status(200).type('application/json').send(getStateAsJson())
}

/**
 * (GET)
 * Return the app logs (plain text)
 *
 * @param {Object} request - Express HTTP request
 * @param {Object} response - Express HTTP response
 * @return {undefined}
 */
const responseViewLogs = (request, response) => {
  response.status(200).type('text/plain').send(getLogs())
}

/**
 * (GET)
 * Start an SSE connection
 * - Register the SSE client for future updates
 * - Send it the current state
 *
 * @param {Object} request - Express HTTP request
 * @param {Object} response - Express HTTP response
 * @return {undefined}
 */
const responseSse = (request, response) => {
  const clientId = registerSseClient({ request, response })
  sendStateUpdateToClients(clientId)
}

/**
 * Send a state update to the connected SSE clients, or a specific client
 *
 * @param {string} clientId - The ID of the client (generated when it was registered)
 *                            Or null to send the state to all clients
 * @return {undefined}
 */
const sendStateUpdateToClients = (clientId = null) => {
  const data = {
    currentModeId: getCurrentModeId(),
    currentModeData: getCurrentModeData()
  }
  sendSseEventToClients({ clientId, eventName: 'stateUpdate', data })
}

