const { getMatrix } = require('../../helpers/matrix.js')

const m = {}
module.exports = m

let cachedWaitInterval = null
let cachedBlinkTimeout = null

m.getTitle = () => {
  return 'Idle'
}

m.getDescription = () => {
  return 'Default mode with LED screen off'
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
  cachedWaitInterval = setInterval(drawBlink, 2000)
  drawBlink()
}

m.update = () => {
}

m.stop = () => {
  if (cachedWaitInterval) {
    clearInterval(cachedWaitInterval)
  }
  if (cachedBlinkTimeout) {
    clearTimeout(cachedBlinkTimeout)
  }
  getMatrix().clear().sync()
}

const drawBlink = () => {
  const matrix = getMatrix()
  matrix.fgColor(0xffffff)
  matrix.setPixel(0, 31)
  matrix.sync()
  cachedBlinkTimeout = setTimeout(() => {
    matrix.clear().sync()
  }, 500)
}
