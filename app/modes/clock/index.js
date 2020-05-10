const { getColorFromHex } = require('../../helpers/colors.js')
const { getMatrix, getMatrixFont, clearMatrixAndSync } = require('../../helpers/matrix.js')
const { isDryRun, withZero } = require('../../helpers/system.js')
const JsonValidator = require('jsonschema').Validator

const m = {}
module.exports = m

let cachedDrawTimeout = null
let cachedData = null

m.getTitle = () => {
  return 'Digital clock'
}

m.getDescription = () => {
  return 'Display the current time'
}

m.startMode = (rawData) => {
  cachedData = getSanitizedData(rawData)
  drawClock()
  return cachedData
}

m.applyModeAction = (action, rawData) => {
  if (action === 'setSettings') {
    const dataErrors = getDataErrors(rawData)
    if (dataErrors !== null) {
      throw new Error(`Invalid data (${dataErrors})`)
    }
    cachedData = rawData
    drawClock()
    return cachedData
  }
  throw new Error('Invalid action')
}

m.stopMode = () => {
  if (cachedDrawTimeout) {
    clearTimeout(cachedDrawTimeout)
    cachedDrawTimeout = null
  }
  clearMatrixAndSync()
}

const getDataErrors = (rawData) => {
  const schema = {
    type: 'object',
    additionalProperties: false,
    properties: {
      format: { type: 'string', enum: ['24h', 'ampm'] },
      withSeconds: { type: 'boolean' },
      color: { type: 'string' },
    },
    required: ['format', 'withSeconds', 'color'],
  }
  const validation = new JsonValidator().validate(rawData, schema)
  return validation.valid ? null : validation.errors.map((error) => error.message).join(', ')
}

const getSanitizedData = (rawData) => {
  return getDataErrors(rawData) === null ? rawData : {
    format: '24h',
    withSeconds: false,
    color: 'ffffff',
  }
}

const drawClock = () => {
  if (isDryRun()) {
    return
  }
  const date = new Date()
  let hours = date.getHours()
  const amPm = hours > 12 ? 'PM' : 'AM'
  if (cachedData.format === 'ampm') {
    hours = hours % 12
    hours = hours ? hours : 12
  }
  const formattedHours = withZero(hours)
  const formattedMinutes = withZero(date.getMinutes())
  const formattedSeconds = withZero(date.getSeconds())
  const formattedTimeY = cachedData.format === 'ampm' || cachedData.withSeconds ? 1 : 12
  getMatrix().clear()
  getMatrix().fgColor(getColorFromHex(cachedData.color))
  getMatrix().font(getMatrixFont('6x9'))
  getMatrix().drawText(`${formattedHours}:${formattedMinutes}`, 1, formattedTimeY)
  if (cachedData.withSeconds) {
    getMatrix().drawText(formattedSeconds, 1, 23)
  }
  if (cachedData.format === 'ampm') {
    getMatrix().drawText(amPm, 19, 23)
  }
  getMatrix().sync()
  cachedDrawTimeout = setTimeout(drawClock, 1000 - new Date().getMilliseconds())
}
