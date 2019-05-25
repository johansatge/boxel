module.exports = {
  random : () => {
    return {
      r : Math.floor(Math.random() * 256),
      g : Math.floor(Math.random() * 256),
      b : Math.floor(Math.random() * 256),
    }
  },
  lightGrey : () => {
    return {
      r : 200,
      g : 200,
      b : 200,
    }
  },
  middleGrey : () => {
    return {
      r : 127,
      g : 127,
      b : 127,
    }
  },
  deepGrey : () => {
    return {
      r : 40,
      g : 40,
      b : 40,
    }
  },
  orange : () => {
    return {
      r : 255,
      g : 57,
      b : 28,
    }
  },
}
