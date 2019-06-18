const colors = require('../helpers/colors.js')
const LedMatrix = require('node-rpi-rgb-led-matrix')

const m = {}
module.exports = m

const matrix = new LedMatrix(32)

m.getId = function() {
  return 'random'
}

m.getTitle = function() {
  return 'Random colors'
}

m.start = function() {
  for(let y = 0; y < 32; y += 1) {
    for(let x = 0; x < 32; x += 1) {
      const color = colors.random()
      matrix.setPixel(x, y, color.r, color.g, color.b)
    }
  }
}

m.stop = function() {
  matrix.clear()
}
