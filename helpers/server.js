const express = require('express')
const { log } = require('./log.js')
const { getAvailableModes, isValidMode, startMode } = require('./modes.js')
const {
  registerSseClient,
  sendSseEventToClient,
  sendSseEventToClients,
  startSsePing,
} = require('./sse.js')
const path = require('path')
const pkg = require('../package.json')
const { getState, setStateCurrentMode, setStateModeData } = require('./state.js')
const { requestShutdown, isDryRun, getUrls, getPort } = require('./system.js')

const m = {}
module.exports = m

m.startServer = async function() {
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

  app.listen(getPort(), function () {
    log(`Server started (${isDryRun() ? 'DRY' : 'LIVE'}) (${getUrls().join(', ')})`)
    startSsePing()
  })
}

async function responseHome(request, response) {
  const modes = getAvailableModes()
  response.status(200).render('index', { viewTitle: pkg.name, modes })
}

async function responseSetCurrentMode(request, response) {
  try {
    const updatedState = await setStateCurrentMode(request.params.mode)
    startMode(request.params.mode)
    sendSseEventToClients({ eventName: 'stateUpdate', data: updatedState })
    response.status(200).json({ error: null })
  }
  catch(error) {
    response.status(500).json({ error: error.message })
  }
}

async function responseSetModeData(request, response) {
  try {
    const updatedState = await setStateModeData({
      mode: request.params.mode,
      data: JSON.parse(request.params.data) // @todo sanitize and process data through the right mode,
    })
    sendSseEventToClients({ eventName: 'stateUpdate', data: updatedState })
    response.status(200).json({ error: null })
  }
  catch(error) {
    response.status(500).json({ error: error.message })
  }
}

async function responseShutdown(request, response) {
  requestShutdown()
  response.status(200).json({ error: null })
}

async function responseViewState(request, response) {
  try {
    const state = await getState()
    response.status(200).json(state)
  }
  catch(error) {
    response.status(500).send(error.message)
  }
}

async function responseSse(request, response) {
  const clientId = registerSseClient({ request, response })
  const state = await getState()
  sendSseEventToClient({ clientId, eventName: 'stateUpdate', data: state })
}

