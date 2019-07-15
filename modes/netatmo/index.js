const m = {}
module.exports = m

m.getId = function() {
  return 'netatmo'
}

m.getTitle = function() {
  return 'Station Netatmo'
}

m.start = function(matrix) {
  // do nothing for now
}

m.stop = function(matrix) {
  matrix.clear()
}

// const netatmo = require('netatmo')
//
// const auth = {
//   client_id     : process.env.NETATMO_CLIENT_ID,
//   client_secret : process.env.NETATMO_CLIENT_SECRET,
//   username      : process.env.NETATMO_USERNAME,
//   password      : process.env.NETATMO_PASSWORD,
// };
//
// const getStats = () => {
//   return new Promise((resolve, reject) => {
//     const api = new netatmo(auth);
//     api.getStationsData((error, devices) => {
//       if (error) {
//         return reject(error)
//       }
//       if (!devices[0] || !devices[0]['modules'] || !devices[0]['modules'][0]) {
//         return reject(new Error('Unable to extract data from API response'))
//       }
//       const station = devices[0]
//       resolve({
//         interiorTemp     : station['dashboard_data']['Temperature'],
//         interiorHumidity : station['dashboard_data']['Humidity'],
//         interiorCO2      : station['dashboard_data']['CO2'],
//         exteriorTemp     : station['modules'][0]['dashboard_data']['Temperature'],
//         exteriorHumidity : station['modules'][0]['dashboard_data']['Humidity'],
//       })
//     })
//   })
// }
//
// module.exports = {
//   getStats : getStats,
// }
//
//
// require('dotenv').config()
//
// const chars     = require('./characters.js')
// const colors    = require('./colors.js')
// const LedMatrix = require('node-rpi-rgb-led-matrix')
// const netatmo   = require('./netatmo.js')
//
// const matrix = new LedMatrix(32)
// // matrix.fill(255, 50, 100);
//
// let translateX = 0
// let translateY = 0
//
// netatmo.getStats()
//   .then((stats) => {
//     console.log(stats)
//     matrix.clear()
//     writeBorder(colors.middleGrey())
//     writeLine(getChars(stats.interiorTemp + '°'), 2, 2)
//     writeLine(getChars(stats.interiorHumidity + '%'), 2, 11)
//     const interiorCO2 = getChars(stats.interiorCO2)
//     writeLine(interiorCO2.concat(chars.getCO2()), 2, 20)
//     waitClearExit()
//   })
//   .catch((error) => {
//     console.log(error.message)
//   })
//
// const getChars = (text) => {
//   const charsList = []
//   text = String(text)
//   text.split('').map((char) => {
//     charsList.push(chars.get(char))
//   })
//   return charsList
// }
//
// const writeLine = (chars, startX, startY) => {
//   chars.map((char) => {
//     // const color = colors.random()
//     const color = colors.middleGrey()
//     char.pixels.map((pixel) => {
//       matrix.setPixel(startX + pixel.x, startY + pixel.y, color.r, color.g, color.b)
//     })
//     startX += char.maxX + 1
//   })
// }
//
// const writeBorder = (color) => {
//   for(let pos = 0; pos < 32; pos += 1) {
//     matrix.setPixel(pos, 0, color.r, color.g, color.b)
//     matrix.setPixel(pos, 31, color.r, color.g, color.b)
//     matrix.setPixel(0, pos, color.r, color.g, color.b)
//     matrix.setPixel(31, pos, color.r, color.g, color.b)
//   }
// }
//
// // const letters = ['T', 'H', 'X', '!', 'u']
// // ['1', '2', '°'].map((char) => {
// //   const charData = chars.get(char)
// //   const color = colors.random()
// //   charData.pixels.map((pixel) => {
// //     matrix.setPixel(translateX + pixel.x, translateY + pixel.y, color.r, color.g, color.b)
// //   })
// //   translateX += charData.maxX + 1
// // })
//
// const waitClearExit = () => {
//   setTimeout(() => {
//     matrix.clear()
//     console.log('Done')
//     process.exit(0)
//   }, 10000)
// }


// const chars     = require('./helpers/characters.js')
// const colors    = require('./helpers/colors.js')
// const LedMatrix = require('node-rpi-rgb-led-matrix')
//
// const matrix = new LedMatrix(32)
//
// matrix.clear()
// writeBorder(colors.middleGrey())
// writeLine(getChars('123'), 2, 2)
// writeLine(getChars('456'), 2, 11)
// writeLine(getChars('78!'), 2, 20)
// waitClearExit()
//
// function getChars(text) {
//   const charsList = []
//   text = String(text)
//   text.split('').map((char) => {
//     charsList.push(chars.get(char))
//   })
//   return charsList
// }
//
// function writeLine(chars, startX, startY) {
//   chars.map((char) => {
//     const color = colors.random()
//     // const color = colors.middleGrey()
//     char.pixels.map((pixel) => {
//       matrix.setPixel(startX + pixel.x, startY + pixel.y, color.r, color.g, color.b)
//     })
//     startX += char.maxX + 1
//   })
// }
//
// function writeBorder(color) {
//   for(let pos = 0; pos < 32; pos += 1) {
//     matrix.setPixel(pos, 0, color.r, color.g, color.b)
//     matrix.setPixel(pos, 31, color.r, color.g, color.b)
//     matrix.setPixel(0, pos, color.r, color.g, color.b)
//     matrix.setPixel(31, pos, color.r, color.g, color.b)
//   }
// }
//
// function waitClearExit() {
//   setTimeout(() => {
//     matrix.clear()
//     console.log('Done')
//     process.exit(0)
//   }, 3000)
// }
