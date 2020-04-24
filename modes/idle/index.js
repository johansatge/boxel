const { getMatrix } = require('../../helpers/matrix.js')

const m = {}
module.exports = m

let waitInterval = null
let blinkTimeout = null

m.getTitle = function() {
  return 'Idle'
}

m.getDescription = function() {
  return 'Default mode with LED screen off'
}

m.start = function() {
  waitInterval = setInterval(blink, 2000)
  blink()
}

m.stop = function() {
  if (waitInterval) {
    clearTimeout(waitInterval)
  }
  if (blinkTimeout) {
    clearTimeout(blinkTimeout)
  }
  getMatrix().clear().sync()
}

function blink() {
  const matrix = getMatrix()
  matrix.fgColor(0xffffff)
  matrix.setPixel(0, 31)
  matrix.sync()
  blinkTimeout = setTimeout(() => {
    matrix.clear().sync()
  }, 500)
}
