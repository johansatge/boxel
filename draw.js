const chars     = require('./characters.js')
const colors    = require('./colors.js')
const LedMatrix = require('node-rpi-rgb-led-matrix')

const matrix = new LedMatrix(32)

matrix.clear()
for(let y = 0; y < 32; y += 1) {
  for(let x = 0; x < 32; x += 1) {
    const color = colors.random()
    matrix.setPixel(x, y, color.r, color.g, color.b)
  }
}

setTimeout(() => {
  matrix.clear()
  console.log('Done')
}, 5000)
