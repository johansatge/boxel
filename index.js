const express = require('express')
const { log } = require('./helpers/log.js')
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

const modes = [
  require('./modes/idle/index.js'),
  require('./modes/white/index.js'),
  require('./modes/random/index.js'),
  require('./modes/logo/index.js'),
  require('./modes/netatmo/index.js'),
  require('./modes/clock/index.js'),
  require('./modes/freegrid/index.js'),
]
const defaultMode = 'idle'

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
  const data = {
    viewTitle: pkg.name,
    modes,
  }
  response.status(200).render('index', data)
}

function responseSetMode(request, response) {
  getState({ defaultMode })
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
  getState({ defaultMode })
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
  getState({ defaultMode }).then((state) => {
    response.status(200).json(state)
  })
}

function responseSse(request, response) {
  const clientId = registerSseClient({ request, response })
  getState({ defaultMode }).then((state) => {
    sendSseEventToClient({ clientId, eventName: 'stateUpdate', data: state })
  })
}

