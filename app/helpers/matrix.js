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
    parallel: 1,
    pwmLsbNanoseconds: 65, // The default "130" doesn't work well
                           // Having a smaller value is needed to avoid flickering
                           // when displaying full images
  }
  const runtimeOptions = {
    ...LedMatrix.defaultRuntimeOptions(),
    gpioSlowdown: 3, // On the Pi 2B, the default "1" is too fast
                     // 2 is the minimum to avoid flickering (put 3 for safety)
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
  // 4x6, 5x7, 5x8
  // 6x9, 6x10, 6x12, 6x13, 6x13B, 6x13O
  // 7x13, 7x13B, 7x13O, 7x14, 7x14B
  // 8x13, 8x13B, 8x13O
  // 9x15, 9x15B, 9x18, 9x18B, 10x20
  const fontPath = path.join(__dirname, `../node_modules/rpi-led-matrix/fonts/${name}.bdf`)
  return new Font(name, fontPath)
}

m.clearMatrixAndSync = () => {
  if (isDryRun()) {
    return
  }
  cachedMatrix.clear().sync()
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
