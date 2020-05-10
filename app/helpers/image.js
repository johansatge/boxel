const crypto = require('crypto')
const fs = require('fs').promises
const { PNG } = require('pngjs')

const m = {}
module.exports = m

const cachedImages = {}

m.loadPixelsFromBase64 = (base64) => {
  return new Promise((resolve, reject) => {
    base64 = base64.replace('data:image/png;base64,', '')
    const buffer = Buffer.from(base64, 'base64')
    new PNG().parse(buffer, (error, result) => {
      if (error) {
        return reject(error)
      }
      const hash = crypto.createHash('sha1').update(base64).digest('hex')
      cachedImages[hash] = parsePixels(result.data, result.width, result.height)
      resolve(cachedImages[hash])
    })
  })
}

m.loadPixelsFromPng = (imagePath) => {
  if (cachedImages[imagePath]) {
    return Promise.resolve(cachedImages[imagePath])
  }
  return fs.readFile(imagePath)
    .then((buffer) => {
      return new Promise((resolve, reject) => {
        new PNG().parse(buffer, (error, result) => {
          if (error) {
            return reject(error)
          }
          cachedImages[imagePath] = parsePixels(result.data, result.width, result.height)
          resolve(cachedImages[imagePath])
        })
      })
    })
}

const parsePixels = (rawPixels, width, height) => {
  const pixels = []
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const idx = (width * y + x) << 2
      pixels.push({
        x,
        y,
        r: rawPixels[idx],
        g: rawPixels[idx + 1],
        b: rawPixels[idx + 2],
      })
    }
  }
  return pixels
}
