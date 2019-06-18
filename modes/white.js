const colors = require('../helpers/colors.js')
const LedMatrix = require('node-rpi-rgb-led-matrix')

const m = {}
module.exports = m

const matrix = new LedMatrix(32)

m.getId = function() {
  return 'white'
}

m.getTitle = function() {
  return 'White screen'
}

m.start = function() {
  const white = colors.white()
  matrix.fill(white.r, white.g, white.b)
}

m.stop = function() {
  matrix.clear()
}
