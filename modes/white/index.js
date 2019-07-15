const m = {}
module.exports = m

m.getId = function() {
  return 'white'
}

m.getTitle = function() {
  return 'White screen'
}

m.start = function(matrix) {
  matrix.fill(255, 255, 255)
}

m.stop = function(matrix) {
  matrix.clear()
}
