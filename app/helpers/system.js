const exec = require('child_process').exec
const { log } = require('./log.js')
const os = require('os')

const  m = {}
module.exports = m

let cachedUrls = null

m.requestShutdown = () => {
  log(m.isDryRun() ? 'Ignoring shutdown command' : 'Sending shutdown command')
  if (!m.isDryRun()) {
    exec('sudo shutdown -h now')
  }
}

m.isDryRun = () => {
  return process.argv.includes('--dry-run')
}

m.getPort = () => {
  return 3030
}

m.getUrls = () => {
  if (cachedUrls !== null) {
    return cachedUrls
  }
  cachedUrls = []
  const interfaces = os.networkInterfaces()
  Object.keys(interfaces).forEach((name) => {
    interfaces[name].forEach((interface) => {
      if (interface.family === 'IPv4') {
        cachedUrls.push(`http://${interface.address}:${m.getPort()}`)
      }
    })
  })
  return cachedUrls
}
