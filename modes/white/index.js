// const colors = require('../../helpers/colors.js')

const m = {}
module.exports = m

m.getTitle = function() {
  return 'White screen'
}

m.getDescription = function() {
  return 'Display a white screen'
}

m.start = function() {
  return Promise.resolve()
}

m.stop = function() {
  return Promise.resolve()
}

// m.start = function(matrix) {
//   const white = colors.lightGrey()
//   matrix.fill(white.r, white.g, white.b)
// }

// m.stop = function(matrix) {
//   matrix.clear()
// }
