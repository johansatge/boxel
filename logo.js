const jimp = require('jimp')

jimp.read('logo.png').then((image) => {
  console.log('Image loaded (' + image.bitmap.width + 'x' + image.bitmap.height + ')')
  console.log('Pixel', jimp.intToRGBA(image.getPixelColor(0, 0)))
})
