const m = {}
module.exports = m

m.getColorFromHex = (hex) => {
  let fullHex = null
  if (hex.length === 1) {
    fullHex = `${hex}${hex}${hex}${hex}${hex}${hex}`
  }
  else if (hex.length === 3) {
    fullHex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`
  }
  else if (hex.length === 6) {
    fullHex = hex
  }
  else {
    fullHex = 'ffffff'
  }
  const parts = fullHex.match(/^([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/i)
  return {
    r: parseInt(parts[1], 16),
    g: parseInt(parts[2], 16),
    b: parseInt(parts[3], 16)
  }
}

m.getColorRandom = () => {
  return {
    r: Math.floor(Math.random() * 256),
    g: Math.floor(Math.random() * 256),
    b: Math.floor(Math.random() * 256),
  }
}

m.getColorWhite = () => {
  return {
    r: 255,
    g: 255,
    b: 255,
  }
}

// module.exports = {
//   white : () => {
//     return {
//       r : 255,
//       g : 255,
//       b : 255,
//     }
//   },
//   lightGrey : () => {
//     return {
//       r : 200,
//       g : 200,
//       b : 200,
//     }
//   },
//   middleGrey : () => {
//     return {
//       r : 127,
//       g : 127,
//       b : 127,
//     }
//   },
//   deepGrey : () => {
//     return {
//       r : 40,
//       g : 40,
//       b : 40,
//     }
//   },
//   orange : () => {
//     return {
//       r : 255,
//       g : 57,
//       b : 28,
//     }
//   },
// }
