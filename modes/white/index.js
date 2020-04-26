// const colors = require('../../helpers/colors.js')

const m = {}
module.exports = m

m.getTitle = () => {
  return 'White screen'
}

m.getDescription = () => {
  return 'Display a white screen'
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

// m.start = function(matrix) {
//   const white = colors.lightGrey()
//   matrix.fill(white.r, white.g, white.b)
// }

// m.stop = function(matrix) {
//   matrix.clear()
// }
