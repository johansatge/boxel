const { getColorWhite, getColorRed, getColorGreen } = require('../../helpers/colors.js')
const { getMatrix, getMatrixFont, clearMatrixAndSync } = require('../../helpers/matrix.js')
const { isDryRun, withZero } = require('../../helpers/system.js')
const JsonValidator = require('jsonschema').Validator
const path = require('path')
const { loadPixelsFromBase64 } = require('../../helpers/image.js')

const m = {}
module.exports = m

let cachedData = null

m.getTitle = () => {
  return 'Digital frame'
}

m.getDescription = () => {
  return 'Upload an image and use it as a digital frame'
}

m.startMode = (rawData) => {
  cachedData = getSanitizedData(rawData)
  drawFrame()
  return cachedData
}

m.applyModeAction = (action, rawData) => {
  if (action === 'setImage') {
    const dataErrors = getDataErrors(rawData)
    if (dataErrors !== null) {
      throw new Error(`Invalid data (${dataErrors})`)
    }
    cachedData = rawData
    drawFrame()
    return cachedData
  }
  if (action === 'deleteImage') {
    cachedData.base64image = null
    drawFrame()
    return cachedData
  }
  throw new Error('Invalid action')
}

m.stopMode = () => {
  clearMatrixAndSync()
}

const getDataErrors = (rawData) => {
  const schema = {
    type: 'object',
    additionalProperties: false,
    properties: {
      base64image: { type: 'string' },
    },
    required: ['base64image'],
  }
  const validation = new JsonValidator().validate(rawData, schema)
  return validation.valid ? null : validation.errors.map((error) => error.message).join(', ')
}

const getSanitizedData = (rawData) => {
  return getDataErrors(rawData) === null ? rawData : {
    base64image: null,
  }
}

const drawFrame = () => {
  if (isDryRun()) {
    return
  }
  getMatrix().clear()
  if (cachedData.base64image === null) {
    getMatrix().sync()
    return
  }
  loadPixelsFromBase64(cachedData.base64image).then((pixels) => {
    // @todo fail gracefully if > 32x32 or image error
    pixels.forEach((pixel) => {
      getMatrix().fgColor({ r: pixel.r, g: pixel.g, b: pixel.b})
      getMatrix().setPixel(pixel.x, pixel.y)
    })
    getMatrix().sync()
  })
}
