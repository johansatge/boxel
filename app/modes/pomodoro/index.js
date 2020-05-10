const { getColorWhite, getColorRed, getColorGreen } = require('../../helpers/colors.js')
const { getMatrix, getMatrixFont, clearMatrixAndSync } = require('../../helpers/matrix.js')
const { isDryRun } = require('../../helpers/system.js')
const JsonValidator = require('jsonschema').Validator
const fs = require('fs').promises
const { PNG } = require('pngjs')
const path = require('path')

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
    drawPomodoro()
    return cachedData
  }
  if (action === 'restart') {
    cachedStartTime = Date.now()
    cachedWaitInterval = setInterval(drawPomodoro, 5000) // @todo longer timer
    drawPomodoro()
    return cachedData
  }
  if (action === 'stop') {
    clearInterval(cachedWaitInterval)
    cachedWaitInterval = null
    cachedStartTime = null
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

const drawPomodoro = () => {
  if (isDryRun()) {
    return
  }
  getMatrix().clear()
  const imagePath = path.join(__dirname, 'tomato.png')
  const imageX = 7
  const imageY = 2
  loadImage(imagePath).then(({width, height, pixels}) => {
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const idx = (width * y + x) << 2
        const color = {
          r: pixels[idx],
          g: pixels[idx + 1],
          b: pixels[idx + 2],
        }
        getMatrix().fgColor(color)
        getMatrix().setPixel(imageX + x, imageY + y)
      }
    }
    getMatrix().font(getMatrixFont('6x9'))
    if (cachedStartTime === null) {
      getMatrix().fgColor(getColorWhite())
      getMatrix().drawText('Stop', 3, 22)
    }
    else {
      getMatrix().fgColor(getColorRed())
      getMatrix().drawText('00:00', 1, 22) // @otodo compute current state
    }
    getMatrix().sync()
  })
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
