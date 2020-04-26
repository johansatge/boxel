const { getColorFromHex } = require('../../helpers/colors.js')
const { getMatrix, getMatrixFont } = require('../../helpers/matrix.js')

const m = {}
module.exports = m

let cachedWaitInterval = null
let cachedData = null

m.getTitle = () => {
  return 'Digital clock'
}

m.getDescription = () => {
  return 'Display the current time'
}

m.getDataSchema = () => {
  return {
    type: 'object',
    additionalProperties: false,
    properties: {
      format: { type: 'string', enum: ['24h', 'ampm'] },
      withSeconds: { type: 'boolean' },
      color: { type: 'string' },
    },
    required: ['format', 'withSeconds', 'color'],
  }
}

m.getDefaultData = () => {
  return {
    format: '24h',
    withSeconds: false,
    color: 'ffffff',
  }
}

m.start = (data) => {
  cachedData = data
  cachedWaitInterval = setInterval(drawClock, 800)
  drawClock()
}

m.update = (data) => {
  cachedData = data
  drawClock()
}

m.stop = () => {
  if (cachedWaitInterval) {
    clearInterval(cachedWaitInterval)
  }
  getMatrix().clear().sync()
}

const drawClock = () => {
  const date = new Date()
  let hours = date.getHours()
  if (cachedData.format === 'ampm') {
    hours = hours % 12
    hours = hours ? hours : 12
  }
  const formattedHours = prependZero(hours)
  const formattedMinutes = prependZero(date.getMinutes())
  const formattedSeconds = prependZero(date.getSeconds())
  const formattedTimeY = cachedData.format === 'ampm' || cachedData.withSeconds ? 1 : 12
  getMatrix().clear()
  getMatrix().fgColor(getColorFromHex(cachedData.color))
  getMatrix().font(getMatrixFont('6x9'))
  getMatrix().drawText(`${formattedHours}:${formattedMinutes}`, 1, formattedTimeY)
  if (cachedData.withSeconds) {
    getMatrix().drawText(formattedSeconds, 1, 23)
  }
  if (cachedData.format === 'ampm') {
    getMatrix().drawText(hours > 12 ? 'PM' : 'AM', 19, 23)
  }
  getMatrix().sync()
}

const prependZero = (value) => {
  return value > 9 ? `${value}` : `0${value}`
}
