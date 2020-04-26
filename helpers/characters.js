// const characters = {
//   '0' : [[1, 0], [2, 0], [3, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [4, 1], [4, 2], [4, 3], [4, 4], [4, 5], [1, 6], [2, 6], [3, 6]],
//   '1' : [[0, 0], [1, 0], [1, 1], [1, 2], [1, 3], [1, 4], [1, 5], [1, 6]],
//   '2' : [[0, 0], [1, 0], [2, 0], [3, 0], [4, 1], [4, 2], [4, 3], [3, 3], [2, 3], [1, 3], [0, 4], [0, 5], [0, 6], [1, 6], [2, 6], [3, 6], [4, 6]],
//   '3' : [[0, 0], [1, 0], [2, 0], [3, 0], [4, 1], [4, 2], [3, 3], [2, 3], [1, 3], [4, 4], [4, 5], [0, 6], [1, 6], [2, 6], [3, 6]],
//   '4' : [[0, 0], [0, 1], [0, 2], [1, 3], [2, 3], [3, 3], [4, 0], [4, 1], [4, 2], [4, 3], [4, 4], [4, 5], [4, 6]],
//   '5' : [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [0, 1], [0, 2], [0, 3], [1, 3], [2, 3], [3, 3], [4, 4], [4, 5], [0, 6], [1, 6], [2, 6], [3, 6]],
//   '6' : [[1, 0], [2, 0], [3, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [1, 3], [2, 3], [3, 3], [4, 4], [4, 5], [1, 6], [2, 6], [3, 6]],
//   '7' : [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [4, 1], [4, 2], [3, 3], [2, 4], [2, 5], [2, 6]],
//   '8' : [[1, 0], [2, 0], [3, 0], [0, 1], [0, 2], [0, 4], [0, 5], [1, 3], [2, 3], [3, 3], [4, 4], [4, 5], [1, 6], [2, 6], [3, 6], [4, 1], [4, 2]],
//   '9' : [[1, 0], [2, 0], [3, 0], [0, 1], [0, 2], [1, 3], [2, 3], [3, 3], [4, 4], [4, 5], [1, 6], [2, 6], [3, 6], [4, 1], [4, 2]],
//   '%' : [[1, 0], [0, 1], [2, 1], [1, 2], [5, 4], [4, 5], [6, 5], [5, 6], [5, 1], [4, 2], [3, 3], [2, 4], [1, 5]],
//   '°' : [[1, 0], [2, 0], [0, 1], [0, 2], [3, 1], [3, 2], [1, 3], [2, 3]],
//   'T' : [[2, 0], [2, 1], [2, 2], [2, 3], [2, 4], [2, 5], [2, 6], [0, 0], [1, 0], [3, 0], [4, 0]],
//   'H' : [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [4, 0], [4, 1], [4, 2], [4, 3], [4, 4], [4, 5], [4, 6], [1, 3], [2, 3], [3, 3]],
//   'X' : [[0, 0], [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [4, 6], [4, 0], [4, 1], [3, 2], [1, 4], [0, 5], [0, 6]],
//   '.' : [[0, 6]],
//   '!' : [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 6]],
//   ':' : [[0, 2], [0, 4]],
//   'default': [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [4, 1], [4, 2], [4, 3], [4, 4], [4, 5], [4, 6], [1, 6], [2, 6], [3, 6], [4, 6], [1, 2], [2, 3], [3, 4], [1, 4], [3, 2]]
// }

// const symbols = {
//   'CO2' : [[1, 0], [0, 1], [0, 2], [1, 3], [4, 0], [3, 1], [3, 2], [4, 3], [5, 1], [5, 2], [7, 0], [8, 1], [7, 2], [7, 3], [8, 3]],
// }

// const getCO2 = () => {
//   return calculatePixels(symbols.CO2)
// }

// const get = (char) => {
//   const rawPixels = characters[char] || characters['default']
//   return calculatePixels(rawPixels)
// }

// const calculatePixels = (rawPixels) => {
//   const pixels = []
//   let maxX = 0
//   let maxY = 0
//   rawPixels.map((pixel) => {
//     if (pixel[0] > maxX) {
//       maxX = pixel[0]
//     }
//     if (pixel[1] > maxY) {
//       maxY = pixel[1]
//     }
//     pixels.push({
//       x : pixel[0],
//       y : pixel[1],
//     })
//   })
//   return {
//     pixels : pixels,
//     maxX  : maxX + 1,
//     maxY  : maxY + 1,
//   }
// }

// module.exports = {
//   get    : get,
//   getCO2 : getCO2,
// }
