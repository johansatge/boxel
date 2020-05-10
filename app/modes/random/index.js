const { getMatrix, clearMatrixAndSync } = require('../../helpers/matrix.js')
const { getColorRandom } = require('../../helpers/colors.js')
const { isDryRun } = require('../../helpers/system.js')
const JsonValidator = require('jsonschema').Validator

const m = {}
module.exports = m

let cachedDrawTimeout = null
let cachedData = null

m.getTitle = () => {
  return 'Random colors'
}

m.getDescription = () => {
  return 'Display random pixels'
}

m.startMode = (rawData) => {
  cachedData = getSanitizedData(rawData)
  drawRandomPixels()
  return cachedData
}

m.applyModeAction = (action, rawData) => {
  if (action === 'setSettings') {
    const dataErrors = getDataErrors(rawData)
    if (dataErrors !== null) {
      throw new Error(`Invalid data (${dataErrors})`)
    }
    cachedData = rawData
    drawRandomPixels()
    return cachedData
  }
  if (action === 'randomizePixels') {
    drawRandomPixels()
    return cachedData
  }  
  throw new Error('Invalid action')
}

m.stopMode = () => {
  clearDrawTimeout()
  clearMatrixAndSync()
}

const getDataErrors = (rawData) => {
  const schema = {
    type: 'object',
    additionalProperties: false,
    properties: {
      withAnimation: { type: 'boolean' },
    },
    required: ['withAnimation'],
  }
  const validation = new JsonValidator().validate(rawData, schema)
  return validation.valid ? null : validation.errors.map((error) => error.message).join(', ')
}

const getSanitizedData = (rawData) => {
  return getDataErrors(rawData) === null ? rawData : {
    withAnimation: false,
  }
}

const drawRandomPixels = () => {
  if (isDryRun()) {
    return
  }
  getMatrix().clear()
  const max =  Math.floor(Math.random() * (32 * 32))
  for(let rand = 0; rand < max; rand += 1) {
    const x = Math.floor(Math.random() * 32)
    const y = Math.floor(Math.random() * 32)
    getMatrix().fgColor(getColorRandom())
    getMatrix().setPixel(x, y)
  }
  getMatrix().sync()
  clearDrawTimeout()
  if (cachedData.withAnimation) {
    setTimeout(drawRandomPixels, 30 * 1000)
  }
}

const clearDrawTimeout = () => {
  if (cachedDrawTimeout) {
    clearTimeout(cachedDrawTimeout)
    cachedDrawTimeout = null
  }
}
