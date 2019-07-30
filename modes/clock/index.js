const chars = require('../../helpers/characters.js')
const colors = require('../../helpers/colors.js')

const m = {}
module.exports = m

let ledMatrix = null
let timeout = null

m.getId = function() {
  return 'clock'
}

m.getTitle = function() {
  return 'Digital clock'
}

m.start = function(matrix) {
  ledMatrix = matrix
  setTime()
}

m.stop = function(matrix) {
  matrix.clear()
  ledMatrix = null
  if (timeout) {
    clearTimeout(timeout)
    timeout = null
  }
}

function setTime() {
  ledMatrix.clear()
  const date = new Date()
  const readableTime = `${date.getHours()}:${date.getMinutes()}`
  const readableSeconds = date.getSeconds() > 9 ? date.getSeconds() : `0${date.getSeconds()}`
  writeLine(ledMatrix, getChars(readableTime), 2, 2)
  writeLine(ledMatrix, getChars(readableSeconds), 2, 23)
  timeout = setTimeout(setTime, 1000)
}

function writeLine(matrix, chars, startX, startY) {
  chars.map((char) => {
    // const color = colors.random()
    const color = colors.middleGrey()
    char.pixels.map((pixel) => {
      matrix.setPixel(startX + pixel.x, startY + pixel.y, color.r, color.g, color.b)
    })
    startX += char.maxX + 1
  })
}

function getChars(text) {
  return String(text).split('').map((char) => chars.get(char))
}
