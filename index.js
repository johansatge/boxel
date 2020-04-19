const express = require('express')
const { log } = require('./helpers/log.js')
const { getAvailableModes, getDefaultMode } = require('./helpers/modes.js')
const {
  registerSseClient,
  sendSseEventToClient,
  sendSseEventToClients,
  startSsePing,
} = require('./helpers/sse.js')
const path = require('path')
const pkg = require('./package.json')
const { getState, setState } = require('./helpers/state.js')
const { requestShutdown, isDryRun } = require('./helpers/system.js')

const app = express()
const port = 3030

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '.'))

app.get('/', responseHome)
app.get('/shutdown', responseShutdown)
app.get('/setmode/:mode', responseSetMode)
app.get('/setstate', responseSetState)
app.get('/sse', responseSse)
app.get('/state', responseState)
app.use('/static', express.static(path.join(__dirname, 'static')))

app.listen(port, function () {
  log(`Server started on http://localhost:${port} (${isDryRun() ? 'DRY' : 'LIVE'})`)
  startSsePing()
})

function responseHome(request, response) {
  getAvailableModes()
    .then((modes) => {
      response.status(200).render('index', { viewTitle: pkg.name, modes })
    })
    .catch((error) => {
      response.status(500).send(`Could not get modes (${error.message})`)
    })
}

function responseSetMode(request, response) {
  getState()
    .then((state) => {
      return setState({ currentMode: request.params.mode, stateData: state.data })
    })
    .then((state) => {
      sendSseEventToClients({ eventName: 'stateUpdate', data: state })
      response.status(200).send('ok')
    })
}

function responseSetState(request, response) {
  const mode = request.query.mode
  const data = JSON.parse(request.query.data)
  getState()
    .then((state) => {
      state.data[mode] = data
      return setState({ currentMode: state.currentMode, stateData: state.data })
    })
    .then((state) => {
      sendSseEventToClients({ eventName: 'stateUpdate', data: state })
      response.status(200).send('ok')
    })
}

function responseShutdown(request, response) {
  requestShutdown()
  response.status(200).send('ok')
}

function responseState(request, response) {
  getState().then((state) => {
    response.status(200).json(state)
  })
}

function responseSse(request, response) {
  const clientId = registerSseClient({ request, response })
  getState().then((state) => {
    sendSseEventToClient({ clientId, eventName: 'stateUpdate', data: state })
  })
}

