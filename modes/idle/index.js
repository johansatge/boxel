const m = {}
module.exports = m

m.getId = function() {
  return 'idle'
}

m.getTitle = function() {
  return 'Idle'
}

m.getDescription = function() {
  return 'Default mode with LED screen off'
}

// m.start = function(matrix) {
//   // do nothing for now
// }

// m.stop = function(matrix) {
//   matrix.clear()
// }
