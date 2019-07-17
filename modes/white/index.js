const colors = require('../../helpers/colors.js')

const m = {}
module.exports = m

m.getId = function() {
  return 'white'
}

m.getTitle = function() {
  return 'White screen'
}

m.start = function(matrix) {
  const white = colors.white()
  matrix.fill(white.r, white.g, white.b)
}

m.stop = function(matrix) {
  matrix.clear()
}
