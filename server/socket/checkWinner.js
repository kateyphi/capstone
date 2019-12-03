function checkWinner(rooms, roomName) {
  const room = rooms[roomName]
  console.log(room)
  if (!room.blueScore) console.log('BLUE WINS!')
  else if (!room.redScore) console.log('RED WINS!')
}

module.exports = checkWinner
