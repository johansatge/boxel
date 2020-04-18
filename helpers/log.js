const { format } = require('date-fns')

const m = {}
module.exports = m

m.log = function(message) {
  const date = format(new Date(), 'yyyy-MM-dd HH:mm:ss O')
  console.log(`${date}: ${message}`)
}
