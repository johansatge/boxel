// const netatmo = require('netatmo')
// const chars = require('../../helpers/characters.js')
// const colors = require('../../helpers/colors.js')

const m = {}
module.exports = m

// const api = new netatmo({
//   client_id: process.env.NETATMO_CLIENT_ID,
//   client_secret: process.env.NETATMO_CLIENT_SECRET,
//   username: process.env.NETATMO_USERNAME,
//   password: process.env.NETATMO_PASSWORD,
// })

m.getTitle = function() {
  return 'Netatmo weather'
}

m.getDescription = function() {
  return '@todo description'
}

// m.start = function(matrix) {
//   let translateX = 0
//   let translateY = 0
//   getStats()
//     .then((stats) => {
//       matrix.clear()
//       writeBorder(matrix, colors.middleGrey())
//       writeLine(matrix, getChars(stats.interiorTemp + '°'), 2, 2)
//       writeLine(matrix, getChars(stats.interiorHumidity + '%'), 2, 11)
//       const interiorCo2 = getChars(stats.interiorCo2)
//       writeLine(matrix, interiorCo2.concat(chars.getCO2()), 2, 20)
//     })
//     .catch((error) => {
//       // @todo handle error
//     })
// }

// m.stop = function(matrix) {
//   matrix.clear()
// }

// function getChars(text) {
//   return String(text).split('').map((char) => chars.get(char))
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

// function writeBorder(matrix, color) {
//   for(let pos = 0; pos < 32; pos += 1) {
//     matrix.setPixel(pos, 0, color.r, color.g, color.b)
//     matrix.setPixel(pos, 31, color.r, color.g, color.b)
//     matrix.setPixel(0, pos, color.r, color.g, color.b)
//     matrix.setPixel(31, pos, color.r, color.g, color.b)
//   }
// }

// function getStats() {
//   return new Promise((resolve, reject) => {
//     api.getStationsData((error, devices) => {
//       if (error) {
//         return reject(error)
//       }
//       if (!devices[0] || !devices[0]['modules'] || !devices[0]['modules'][0]) {
//         return reject(new Error('Unable to extract data from API response'))
//       }
//       const station = devices[0]
//       const exteriorModule = station['modules'].length > 0 ? station['modules'][0] : null
//       resolve({
//         interiorTemp: station['dashboard_data']['Temperature'],
//         interiorHumidity: station['dashboard_data']['Humidity'],
//         interiorCo2: station['dashboard_data']['CO2'],
//         exteriorTemp: exteriorModule ? exteriorModule['dashboard_data']['Temperature'] : -1,
//         exteriorHumidity: exteriorModule ? exteriorModule['dashboard_data']['Humidity'] : -1,
//       })
//     })
//   })
// }
