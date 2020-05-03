const fs = require('fs').promises
const { PNG } = require('pngjs')
const path = require('path')
const { getMatrix } = require('../../helpers/matrix.js')

const m = {}
module.exports = m

m.getTitle = () => {
  return 'Logo'
}

m.getDescription = () => {
  return '@todo description'
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
}

m.update = () => {
}

m.stop = () => {
  getMatrix().clear().sync()
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
