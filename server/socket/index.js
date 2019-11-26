const deck = require('../classes/deck')

let rooms = {}

const newRound = (roomName, io) => {
  const room = rooms[roomName]
  const freshBoardState = {
    1: {team: 'red', role: 'codemaster'},
    2: {team: 'red', role: 'guesser'},
    3: {team: 'blue', role: 'codemaster'},
    4: {team: 'blue', role: 'guesser'},
    colors: {
      red: [],
      blue: [],
      beige: [],
      gray: []
    },
    currentClue: {clue: '', player: 0},
    activePlayer: 0
  }
  room.deck.newDeck()
  room.boardstate = freshBoardState
  room.boardstate.activePlayer = 1
  io.in(roomName).emit('update_boardstate', room.boardstate)
  io.in(roomName).emit('gameready')
}

module.exports = io => {
  io.on('connection', socket => {
    console.log(`A socket connection to the server has been made: ${socket.id}`)

    socket.on('disconnect', () => {
      console.log(`Connection ${socket.id} has left the building`)
    })

    socket.on('get available rooms', () => {
      let openRooms = Object.keys(rooms)
      openRooms = openRooms.filter(room => rooms[room].players.length < 4)
      openRooms = openRooms.map(room => [room, rooms[room].players.length])
      socket.emit('open rooms', openRooms)
    })

    socket.on('joinroom', roomName => {
      if (!rooms[roomName])
        rooms[roomName] = {
          deck: new deck(),
          players: [],
          boardstate: {}
        }
      const players = rooms[roomName].players
      if (players.length < 4) {
        players.push({id: socket.id, player: players.length + 1})
        socket.join(roomName)
        socket.emit('joinedroom', roomName, players.length)
        if (players.length === 4) newRound(roomName, io)
      }
    })

    socket.on('codemaster view', roomName => {
      socket.emit('codemaster view', rooms[roomName].deck)
    })

    socket.on('guesser view', roomName => {
      socket.emit('guesser view', rooms[roomName].deck.words)
    })

    socket.on('give clue', (roomName, clue) => {
      const {player} = rooms[roomName].players.filter(
        client => client.id === socket.id
      )[0]
      rooms[roomName].boardstate.currentClue.clue = clue
      rooms[roomName].boardstate.currentClue.player = player
      rooms[roomName].boardstate.activePlayer =
        rooms[roomName].boardstate.activePlayer % 4 + 1
      io.in(roomName).emit('update_boardstate', rooms[roomName].boardstate)
    })

    socket.on('change turn', roomName => {
      rooms[roomName].boardstate.activePlayer =
        rooms[roomName].boardstate.activePlayer % 4 + 1
      io.in(roomName).emit('update_boardstate', rooms[roomName].boardstate)
    })

    socket.on('newgame', roomName => {
      newRound(roomName, io)
    })
  })
}
