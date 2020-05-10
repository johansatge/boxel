const fs = require('fs').promises
const { PNG } = require('pngjs')
const path = require('path')
const { getMatrix, clearMatrix } = require('../../helpers/matrix.js')
const { isDryRun } = require('../../helpers/system.js')

const m = {}
module.exports = m

m.getTitle = () => {
  return 'Logo'
}

m.getDescription = () => {
  return 'Display a static 32x32 PNG logo'
}

m.startMode = (rawData) => {
  if (isDryRun()) {
    return
  }
  const logoPath = path.join(__dirname, 'logo.png')
  loadLogo(logoPath).then(({width, height, pixels}) => {
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const idx = (width * y + x) << 2
        const color = {
          r: pixels[idx],
          g: pixels[idx + 1],
          b: pixels[idx + 2],
        }
        getMatrix().fgColor(color)
        getMatrix().setPixel(x, y)
      }
    }
    getMatrix().sync()
  })
  .catch((error) => {
    console.log(error)
  })
  return {}
}

m.applyModeAction = (action, rawData) => {
  // This mode doesn't accept actions
  return null
}

m.stopMode = () => {
  clearMatrix()
}

const loadLogo = (logoPath) => {
  return fs.readFile(logoPath)
    .then((buffer) => {
      return new Promise((resolve, reject) => {
        new PNG().parse(buffer, (error, result) => {
          error ? reject(error) : resolve({
            width: result.width,
            height: result.height,
            pixels: result.data,
          })
        })
      })
    })
}
