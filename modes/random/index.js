// const colors = require('../../helpers/colors.js')

const m = {}
module.exports = m

let ledMatrix = null

m.getTitle = function() {
  return 'Random colors'
}

m.getDescription = function() {
  return 'Display random pixels'
}

m.start = function() {
}

m.update = function() {
}

m.stop = function() {
}

// m.start = function(matrix) {
//   ledMatrix = matrix
//   randomize()
// }

// m.setState = function(params) {
//   if (params.action === 'randomize') {
//     randomize()
//   }
//   return Promise.resolve()
// }

// m.stop = function(matrix) {
//   matrix.clear()
//   ledMatrix = null
// }

// function randomize() {
//   for(let y = 0; y < 32; y += 1) {
//     for(let x = 0; x < 32; x += 1) {
//       const color = colors.random()
//       ledMatrix.setPixel(x, y, color.r, color.g, color.b)
//     }
//   }
// }
