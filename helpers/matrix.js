const { isDryRun } = require('./system.js')
const { LedMatrix, Font } = require('rpi-led-matrix')
const { log } = require('./log.js')
const path = require('path')

const m = {}
module.exports = m

let matrix = null

m.getMatrix = function() {
  return matrix
}

m.loadMatrix = function() {
  if (isDryRun()) {
    log('Ignoring matrix init')
    return Promise.resolve()
  }
  const matrixOptions = {
    ...LedMatrix.defaultMatrixOptions(),
    rows: 32,
    cols: 32,
    chainLength: 1, // 2,3,4
    brightness: 100, // range?
    // disableHardwarePulsing: boolean;
    // hardwareMapping: GpioMapping;
    // inverseColors: boolean;
    // ledRgbSequence: 'RGB' | 'BGR' | 'BRG' | 'RBG' | 'GRB' | 'GBR';
    // multiplexing: MuxType;
    // parallel: 1 | 2 | 3 | 4;
    // pixelMapperConfig: string;
    // pwmBits: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
    // pwmDitherBits: number;
    // pwmLsbNanoseconds: number;
    // rowAddressType: RowAddressType;
    // scanMode: ScanMode;
    // showRefreshRate: boolean;
  }
  const runtimeOptions = {
    ...LedMatrix.defaultRuntimeOptions(),
    // gpioSlowdown: 1,
    // daemon: RuntimeFlag;
    // doGpioInit: boolean;
    // dropPrivileges: RuntimeFlag;
    // gpioSlowdown: 0 | 1 | 2 | 3 | 4;
  }
  try {
    matrix = new LedMatrix(matrixOptions, runtimeOptions)
    log('Matrix inited')
    return showSplashscreen()
  }
  catch(error) {
    return Promise.reject(error)
  }
}

function showSplashscreen() {
  return new Promise((resolve, reject) => {
    matrix.clear()
    matrix.brightness(50)
    matrix.fgColor(0xffffff)
    matrix.font(new Font('6x12', getFontPath('6x12')))
    matrix.drawText('Boxel', 1, 21)
    matrix.sync()
    setTimeout(() => {
      matrix.clear()
      matrix.sync()
      resolve()
    }, 2000)
  })
}

function getFontPath(fontName) {
  return path.join(__dirname, `../node_modules/rpi-led-matrix/fonts/${fontName}.bdf`)
}
