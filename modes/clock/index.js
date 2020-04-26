// const chars = require('../../helpers/characters.js')
// const colors = require('../../helpers/colors.js')

const m = {}
module.exports = m

m.getTitle = () => {
  return 'Digital clock'
}

m.getDescription = () => {
  return '@todo description'
}

m.start = () => {
}

m.update = () => {
}

m.stop = () => {
}

// let ledMatrix = null
// let timeout = null

// m.start = function(matrix) {
//   ledMatrix = matrix
//   setTime()
// }

// m.stop = function(matrix) {
//   matrix.clear()
//   ledMatrix = null
//   if (timeout) {
//     clearTimeout(timeout)
//     timeout = null
//   }
// }

// function setTime() {
//   ledMatrix.clear()
//   const date = new Date()
//   writeLine(ledMatrix, getChars(`${prependZero(date.getHours())}:${prependZero(date.getMinutes())}`), 2, 2)
//   writeLine(ledMatrix, getChars(prependZero(date.getSeconds())), 2, 23)
//   timeout = setTimeout(setTime, 1000)
// }

// function prependZero(value) {
//   return value > 9 ? value : `0${value}`
// }

// function writeLine(matrix, chars, startX, startY) {
//   chars.map((char) => {
//     // const color = colors.random()
//     const color = colors.middleGrey()
//     char.pixels.map((pixel) => {
//       matrix.setPixel(startX + pixel.x, startY + pixel.y, color.r, color.g, color.b)
//     })
//     startX += char.maxX + 1
//   })
// }

// function getChars(text) {
//   return String(text).split('').map((char) => chars.get(char))
// }
