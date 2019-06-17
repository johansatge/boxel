const LedMatrix = require('node-rpi-rgb-led-matrix')

const matrix = new LedMatrix(32)
// matrix.fill(255, 50, 100)
matrix.setPixel(0, 0, 255, 255, 255)
matrix.setPixel(10, 10, 255, 255, 255)

setTimeout(() => {
  matrix.clear()
  console.log('Done')
  process.exit(0)
}, 5000)
