const crypto = require('crypto')
const { log } = require('./log.js')

const m = {}
module.exports = m

const cachedSseClients = {}

m.startSsePing = () => {
  setInterval(() => {
    m.sendSseEventToClients({ eventName: 'ping', data: null })
  }, 60 * 1000)
}

m.registerSseClient = ({ request, response }) => {
  response.writeHead(200, {
    'Connection': 'keep-alive',
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
  })
  const clientId = crypto.randomBytes(16).toString('hex')
  cachedSseClients[clientId] = response
  log(`Registered SSE client: ${clientId}`)
  request.on('close', () => {
    log(`SSE client left: ${clientId}`)
    delete cachedSseClients[clientId]
  })
  return clientId
}

m.sendSseEventToClients = ({ clientId, eventName, data }) => {
  if (clientId) {
    sendEventToClient({ clientId, eventName, data })
    log(`Sent ${eventName} event to ${clientId}`)
  }
  else {
    Object.keys(cachedSseClients).forEach((clientId) => {
      sendEventToClient({ clientId, eventName, data })
    })
    log(`Sent ${eventName} event to ${Object.keys(cachedSseClients).length} client(s)`)
  }
}

const sendEventToClient = ({ clientId, eventName, data }) => {
  cachedSseClients[clientId].write(`event:${eventName}\ndata: ${JSON.stringify(data)}\n\n`)
}
