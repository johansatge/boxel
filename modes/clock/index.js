const { getColorWhite } = require('../../helpers/colors.js')
const { getMatrix, getMatrixFont } = require('../../helpers/matrix.js')

const m = {}
module.exports = m

let cachedWaitInterval = null

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

m.getDefaultData = () => {
  return {}
}

m.start = () => {
  cachedWaitInterval = setInterval(drawClock, 5000)
  drawClock()
}

m.update = () => {
}

m.stop = () => {
  if (cachedWaitInterval) {
    clearInterval(cachedWaitInterval)
  }
  getMatrix().clear().sync()
}

const drawClock = () => {
  const date = new Date()
  const hours = prependZero(date.getHours())
  const minutes = prependZero(date.getMinutes())
  const seconds = prependZero(date.getSeconds())
  getMatrix().clear()
  getMatrix().fgColor(getColorWhite())
  getMatrix().font(getMatrixFont('6x9'))
  getMatrix().drawText(`${hours}:${minutes}`, 1, 1)
  getMatrix().font(getMatrixFont('9x18'))
  getMatrix().drawText(seconds, 1, 12)
  getMatrix().sync()
}

const prependZero = (value) => {
  return value > 9 ? `${value}` : `0${value}`
}
