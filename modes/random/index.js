const m = {}
module.exports = m

let ledMatrix = null

m.getId = function() {
  return 'random'
}

m.getTitle = function() {
  return 'Random colors'
}

m.start = function(matrix) {
  ledMatrix = matrix
  randomize()
}

m.doAction = function(params) {
  if (params.action === 'randomize') {
    randomize()
  }
  return Promise.resolve()
}

m.stop = function(matrix) {
  matrix.clear()
  ledMatrix = null
}

function randomize() {
  for(let y = 0; y < 32; y += 1) {
    for(let x = 0; x < 32; x += 1) {
      const color = getRandomColor()
      ledMatrix.setPixel(x, y, color.r, color.g, color.b)
    }
  }
}

function getRandomColor() {
  return {
    r : Math.floor(Math.random() * 256),
    g : Math.floor(Math.random() * 256),
    b : Math.floor(Math.random() * 256),
  }
}
