const { isDryRun } = require('./system.js')
const { LedMatrix, Font } = require('rpi-led-matrix')
const { log } = require('./log.js')
const path = require('path')

const m = {}
module.exports = m

let cachedMatrix = null

m.getMatrix = () => {
  return cachedMatrix
}

m.loadMatrix = () => {
  if (isDryRun()) {
    log('Ignoring matrix init')
    return Promise.resolve()
  }
  const matrixOptions = {
    ...LedMatrix.defaultMatrixOptions(),
    rows: 32,
    cols: 32,
    chainLength: 1,
  }
  const runtimeOptions = {
    ...LedMatrix.defaultRuntimeOptions(),
  }
  try {
    cachedMatrix = new LedMatrix(matrixOptions, runtimeOptions)
    log('Matrix inited')
    return showSplashscreen()
  }
  catch(error) {
    return Promise.reject(error)
  }
}

const showSplashscreen = () => {
  return new Promise((resolve, reject) => {
    cachedMatrix.clear()
    cachedMatrix.fgColor(0xffffff)
    cachedMatrix.font(new Font('6x12', getFontPath('6x12')))
    cachedMatrix.drawText('Boxel', 1, 21)
    cachedMatrix.sync()
    setTimeout(() => {
      cachedMatrix.clear()
      cachedMatrix.sync()
      log('Displayed splashscreen')
      resolve()
    }, 2000)
  })
}

const getFontPath = (fontName) => {
  return path.join(__dirname, `../node_modules/rpi-led-matrix/fonts/${fontName}.bdf`)
}
