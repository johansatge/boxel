const { format } = require('date-fns')

const m = {}
module.exports = m

const cachedLogs = []

m.log = (message) => {
  const date = format(new Date(), 'yyyy-MM-dd HH:mm:ss O')
  const formattedMessage = `${date}: ${message}`
  console.log(formattedMessage)
  save(formattedMessage)
}

m.getLogs = () => {
  return cachedLogs.join('\n')
}

const save = (message) => {
  cachedLogs.push(message)
  if (cachedLogs.length > 100) {
    cachedLogs.splice(0, 1)
  }
}
