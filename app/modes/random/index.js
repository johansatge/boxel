const { getMatrix, clearMatrixAndSync } = require('../../helpers/matrix.js')
const { getColorRandom } = require('../../helpers/colors.js')
const { isDryRun } = require('../../helpers/system.js')

const m = {}
module.exports = m

m.getTitle = () => {
  return 'Random colors'
}

m.getDescription = () => {
  return 'Display random pixels'
}

m.startMode = (rawData) => {
  setRandomPixels()
  return {}
}

m.applyModeAction = (action, rawData) => {
  if (action === 'randomizePixels') {
    setRandomPixels()
    return {}
  }
  throw new Error('Invalid action')
}

m.stopMode = () => {
  clearMatrixAndSync()
}

const setRandomPixels = () => {
  if (isDryRun()) {
    return
  }
  getMatrix().clear()
  for(let y = 0; y < 32; y += 1) {
    for(let x = 0; x < 32; x += 1) {
      getMatrix().fgColor(getColorRandom())
      getMatrix().setPixel(x, y)
    }
  }
  getMatrix().sync()
}
