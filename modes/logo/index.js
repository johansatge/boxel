// const jimp = require('jimp')
// const path = require('path')

const m = {}
module.exports = m

m.getTitle = function() {
  return 'Logo'
}

m.getDescription = function() {
  return '@todo description'
}

m.start = function() {
}

m.update = function() {
}

m.stop = function() {
}

// m.start = function(matrix) {
//   jimp.read(path.join(__dirname, 'logo.png')).then((image) => {
//     for(let x = 0; x < image.bitmap.width; x += 1) {
//       for(let y = 0; y < image.bitmap.height; y += 1) {
//         const pixel = jimp.intToRGBA(image.getPixelColor(x, y))
//         matrix.setPixel(x, y, pixel.r, pixel.g, pixel.b)
//       }
//     }
//   })
// }

// m.stop = function(matrix) {
//   matrix.clear()
// }
