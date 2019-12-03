function win(winner, io, roomName) {
  console.log('THIS IS SOCKET', io)
  io.in(roomName).emit('win', winner)
}
function checkWinner(rooms, roomName, io) {
  const room = rooms[roomName]
  if (rooms[roomName].boardstate.colors.blue.length === 8) {
    console.log('BLUE WINS!')
    win('BLUE WINS!', io, roomName)
  }
  if (rooms[roomName].boardstate.colors.red.length === 9) {
    console.log('RED WINS!')
    win('RED WINS!', io, roomName)
  }
  if (
    rooms[roomName].boardstate.activeTeam === 'red' &&
    rooms[roomName].boardstate.colors.grey.length
  ) {
    console.log('RED CHOSE THE ASSASSIN CARD, BLUE WINS!')
    win('RED CHOSE THE ASSASSIN CARD, BLUE WINS!', io, roomName)
  }
  if (
    rooms[roomName].boardstate.activeTeam === 'blue' &&
    rooms[roomName].boardstate.colors.grey.length
  ) {
    console.log('BLUE CHOSE THE ASSASSIN CARD, RED WINS!')
    win('BLUE CHOSE THE ASSASSIN CARD, RED WINS!', io, roomName)
  }
}

module.exports = checkWinner
