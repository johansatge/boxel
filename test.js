const chars     = require('./characters.js')
const colors    = require('./colors.js')
const LedMatrix = require('node-rpi-rgb-led-matrix')

const matrix = new LedMatrix(32)

matrix.clear()
writeBorder(colors.middleGrey())
writeLine(getChars('123'), 2, 2)
writeLine(getChars('456'), 2, 11)
writeLine(getChars('78!'), 2, 20)
waitClearExit()

function getChars(text) {
  const charsList = []
  text = String(text)
  text.split('').map((char) => {
    charsList.push(chars.get(char))
  })
  return charsList
}

function writeLine(chars, startX, startY) {
  chars.map((char) => {
    const color = colors.random()
    // const color = colors.middleGrey()
    char.pixels.map((pixel) => {
      matrix.setPixel(startX + pixel.x, startY + pixel.y, color.r, color.g, color.b)
    })
    startX += char.maxX + 1
  })
}

function writeBorder(color) {
  for(let pos = 0; pos < 32; pos += 1) {
    matrix.setPixel(pos, 0, color.r, color.g, color.b)
    matrix.setPixel(pos, 31, color.r, color.g, color.b)
    matrix.setPixel(0, pos, color.r, color.g, color.b)
    matrix.setPixel(31, pos, color.r, color.g, color.b)
  }
}

function waitClearExit() {
  setTimeout(() => {
    matrix.clear()
    console.log('Done')
    process.exit(0)
  }, 3000)
}
