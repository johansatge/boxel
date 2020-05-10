const { getColorWhite, getColorRed, getColorGreen } = require('../../helpers/colors.js')
const { getMatrix, getMatrixFont, clearMatrixAndSync } = require('../../helpers/matrix.js')
const { isDryRun, withZero } = require('../../helpers/system.js')
const JsonValidator = require('jsonschema').Validator
const path = require('path')
const { loadPixelsFromPng } = require('../../helpers/image.js')

const m = {}
module.exports = m

let cachedDrawTimeout = null
let cachedData = null
let cachedStartTimeMs = null

m.getTitle = () => {
  return 'Pomodoro'
}

m.getDescription = () => {
  return 'Digital pomodoro'
}

m.startMode = (rawData) => {
  cachedData = getSanitizedData(rawData)
  drawPomodoro()
  return cachedData
}

m.applyModeAction = (action, rawData) => {
  if (action === 'setSettings') {
    const dataErrors = getDataErrors(rawData)
    if (dataErrors !== null) {
      throw new Error(`Invalid pomodoro data (${dataErrors})`)
    }
    cachedData = rawData
    stopPomodoro()
    drawPomodoro()
    return cachedData
  }
  if (action === 'restart') {
    cachedStartTimeMs = Date.now()
    drawPomodoro()
    return cachedData
  }
  if (action === 'stop') {
    stopPomodoro()
    drawPomodoro()
    return cachedData
  }
  throw new Error('Invalid pomodoro action')
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
      duration: { type: 'integer', enum: [10, 15, 20, 25] },
      breakDuration: { type: 'integer', enum: [3, 4, 5] },
    },
    required: ['duration'],
  }
  const validation = new JsonValidator().validate(rawData, schema)
  return validation.valid ? null : validation.errors.map((error) => error.message).join(', ')
}

const getSanitizedData = (rawData) => {
  return getDataErrors(rawData) === null ? rawData : {
    duration: 25,
    breakDuration: 5,
  }
}

const stopPomodoro = () => {
  clearTimeout(cachedDrawTimeout)
  cachedDrawTimeout = null
  cachedStartTimeMs = null
}

const drawPomodoro = () => {
  if (isDryRun()) {
    return
  }
  const currentTimer = getCurrentTimer()
  if (currentTimer === null && cachedStartTimeMs !== null) {
    stopPomodoro()
    drawPomodoro()
    return
  }
  getMatrix().clear()
  const imageX = 7
  const imageY = 2
  const imagePath = path.join(__dirname, 'tomato.png')
  loadPixelsFromPng(imagePath).then((pixels) => {
    pixels.forEach((pixel) => {
      getMatrix().fgColor({ r: pixel.r, g: pixel.g, b: pixel.b})
      getMatrix().setPixel(imageX + pixel.x, imageY + pixel.y)
    })
    getMatrix().font(getMatrixFont('6x9'))
    if (cachedStartTimeMs === null) {
      getMatrix().fgColor(getColorWhite())
      getMatrix().drawText('Ready', 1, 22)
      getMatrix().sync()
    }
    else {
      getMatrix().fgColor(currentTimer.color)
      getMatrix().drawText(currentTimer.text, 1, 22)
      getMatrix().sync()
      cachedDrawTimeout = setTimeout(drawPomodoro, 1000 - new Date().getMilliseconds())
    }
  })
}

const getCurrentTimer = () => {
  const durationMs = cachedData.duration * 60 * 1000
  const breakDurationMs = cachedData.breakDuration * 60 * 1000 
  const now = Date.now()
  const periods = [
    { type: 'work', start: 0, stop: durationMs },
    { type: 'break', start: durationMs, stop: durationMs + breakDurationMs },
    { type: 'work', start: durationMs + breakDurationMs, stop: durationMs * 2 + breakDurationMs },
    { type: 'break', start: durationMs * 2 + breakDurationMs, stop: durationMs * 2 + breakDurationMs * 2 },
    { type: 'work', start: durationMs * 2 + breakDurationMs * 2, stop: durationMs * 3 + breakDurationMs * 2 },
    { type: 'break', start: durationMs * 3 + breakDurationMs * 2, stop: durationMs * 3 + breakDurationMs * 3 },
    { type: 'work', start: durationMs * 3 + breakDurationMs * 3, stop: durationMs * 4 + breakDurationMs * 3 },
  ]
  const currentPeriod = periods.find((period) => {
    return now >= cachedStartTimeMs + period.start && now < cachedStartTimeMs + period.stop
  })
  if (!currentPeriod) {
    return null
  }
  const totalRemainingSeconds = Math.round((currentPeriod.stop + cachedStartTimeMs - now) / 1000)
  const remainingMinutes = Math.floor(totalRemainingSeconds / 60)
  const remainingSeconds = Math.floor(totalRemainingSeconds % 60)
  return {
    text: `${withZero(remainingMinutes)}:${withZero(remainingSeconds)}`,
    color: currentPeriod.type === 'work' ? getColorRed() : getColorGreen(),
  }
}
