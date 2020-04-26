const { isDryRun } = require('./system.js')
const { LedMatrix, Font } = require('rpi-led-matrix')
const { log } = require('./log.js')
const path = require('path')
const { getColorWhite } = require('./colors.js')

const m = {}
module.exports = m

let cachedMatrix = null

m.getMatrix = () => {
  return cachedMatrix
}

m.loadMatrix = () => {
  if (isDryRun()) {
    log('Ignored matrix init')
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

m.getMatrixFont = (name) => {
  const fontPath = path.join(__dirname, `../node_modules/rpi-led-matrix/fonts/${name}.bdf`)
  return new Font(name, fontPath)
}

const showSplashscreen = () => {
  return new Promise((resolve, reject) => {
    cachedMatrix.clear()
    cachedMatrix.fgColor(getColorWhite())
    cachedMatrix.font(m.getMatrixFont('6x12'))
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
