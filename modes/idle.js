const jimp = require('jimp')
const LedMatrix = require('node-rpi-rgb-led-matrix')

const m = {}
module.exports = m

const matrix = new LedMatrix(32)

let blinkTimeout = null

m.getId = function() {
  return 'idle'
}

m.getTitle = function() {
  return 'Idle'
}

m.start = function() {
  // do nothing for now
}

m.stop = function() {
  matrix.clear()
  if (blinkTimeout) {
    clearTimeout(blinkTimeout)
    blinkTimeout = null
  }
}
