// const colors = require('../../helpers/colors.js')

const m = {}
module.exports = m

// let ledMatrix = null
// const pixels = {}

m.getTitle = function() {
  return 'Free grid'
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
//   ledMatrix = matrix
// }

// m.setState = function(params) {
//   if (params.action === 'setPixel') {
//     pixels[params.x + '-' + params.y] = {x: parseInt(params.x), y: parseInt(params.y), color: colors.random()}
//     ledMatrix.clear()
//     Object.keys(pixels).forEach((index) => {
//       const pixel = pixels[index]
//       ledMatrix.setPixel(pixel.x, pixel.y, pixel.color.r, pixel.color.g, pixel.color.b)
//     })
//   }
//   return Promise.resolve()
// }

// m.stop = function(matrix) {
//   matrix.clear()
//   ledMatrix = null
// }
