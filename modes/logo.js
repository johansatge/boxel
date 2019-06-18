const jimp = require('jimp')
const LedMatrix = require('node-rpi-rgb-led-matrix')

const m = {}
module.exports = m

const matrix = new LedMatrix(32)

m.getId = function() {
  return 'logo'
}

m.getTitle = function() {
  return 'Logo'
}

m.start = function() {
  jimp.read('logo.png').then((image) => {
    for(let x = 0; x < image.bitmap.width; x += 1) {
      for(let y = 0; y < image.bitmap.height; y += 1) {
        const pixel = jimp.intToRGBA(image.getPixelColor(x, y))
        matrix.setPixel(x, y, pixel.r, pixel.g, pixel.b)
      }
    }
  })
}

m.stop = function() {
  matrix.clear()
}
