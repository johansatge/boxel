const { getMatrix } = require('../../helpers/matrix.js')
const { getColorRandom } = require('../../helpers/colors.js')

const m = {}
module.exports = m

m.getTitle = () => {
  return 'Random colors'
}

m.getDescription = () => {
  return 'Display random pixels'
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
  setRandomPixels()
}

m.update = (data) => {
  setRandomPixels()
}

m.stop = () => {
  getMatrix().clear().sync()
}

const setRandomPixels = () => {
  getMatrix().clear()
  for(let y = 0; y < 32; y += 1) {
    for(let x = 0; x < 32; x += 1) {
      getMatrix().fgColor(getColorRandom())
      getMatrix().setPixel(x, y)
    }
  }
  getMatrix().sync()
}
