// const colors = require('../../helpers/colors.js')

const m = {}
module.exports = m

m.getTitle = () => {
  return 'Free grid'
}

m.getDescription = () => {
  return '@todo description'
}

m.getDataSchema = () => {
  return {
    type: 'object',
    additionalProperties: false,
    properties: {},
    required: [],
  }
}

m.getDefaultData = () => {
  return {}
}

m.start = () => {
}

m.update = () => {
}

m.stop = () => {
}

// let ledMatrix = null
// const pixels = {}

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
