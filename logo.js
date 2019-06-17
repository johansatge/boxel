const jimp = require('jimp')
const LedMatrix = require('node-rpi-rgb-led-matrix')

const matrix = new LedMatrix(32)

console.log('Loading image')
jimp.read('logo.png').then((image) => {
  console.log('Image loaded (' + image.bitmap.width + 'x' + image.bitmap.height + ')')
  for(let x = 0; x < image.bitmap.width; x += 1) {
    for(let y = 0; y < image.bitmap.height; y += 1) {
      const pixel = jimp.intToRGBA(image.getPixelColor(x, y))
      matrix.setPixel(x, y, pixel.r, pixel.g, pixel.b)
    }
  }
  setTimeout(() => {
    matrix.clear()
    console.log('Done')
    process.exit(0)
  }, 5000)
})
