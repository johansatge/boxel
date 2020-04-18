const exec = require('child_process').exec
const { log } = require('./log.js')

const  m = {}
module.exports = m

m.requestShutdown = function() {
  log(m.isDryRun() ? 'Ignoring shutdown command' : 'Sending shutdown command')
  if (!m.isDryRun()) {
    exec('sudo shutdown -h now')
  }
}

m.isDryRun = function() {
  return process.argv.includes('--dry-run')
}
