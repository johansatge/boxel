const { getColorWhite, getColorRed, getColorGreen } = require('../../helpers/colors.js')
const { getMatrix, getMatrixFont, clearMatrixAndSync } = require('../../helpers/matrix.js')
const { isDryRun } = require('../../helpers/system.js')
const JsonValidator = require('jsonschema').Validator
const path = require('path')
const { loadPixelsFromPng } = require('../../helpers/image.js')

const m = {}
module.exports = m

let cachedWaitInterval = null
let cachedData = null
let cachedStartTime = null

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
    cachedStartTime = Date.now()
    cachedWaitInterval = setInterval(drawPomodoro, 800)
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
  if (cachedWaitInterval) {
    clearInterval(cachedWaitInterval)
    cachedWaitInterval = null
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
  clearInterval(cachedWaitInterval)
  cachedWaitInterval = null
  cachedStartTime = null
}

const drawPomodoro = () => {
  if (isDryRun()) {
    return
  }
  const currentTimer = getCurrentTimer()
  if (currentTimer === null) {
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
    if (cachedStartTime === null) {
      getMatrix().fgColor(getColorWhite())
      getMatrix().drawText('Stop', 3, 22)
    }
    else {
      getMatrix().fgColor(currentTimer.color)
      getMatrix().drawText(currentTimer.text, 1, 22)
    }
    getMatrix().sync()
  })
}

const getCurrentTimer = () => {
  // @todo compute timer
  // @todo return null if the timer has expired (4 works + 3 breaks)
  return {
    text: '00:00',
    color: getColorRed(),
  }
}

const loadImage = (imagePath) => {
  return fs.readFile(imagePath)
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
