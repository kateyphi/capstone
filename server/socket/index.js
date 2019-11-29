//require in the 'deck' class which creates a new board:
const deck = require('../classes/deck')

//initialize 'rooms', an object that will contain all of the game rooms that get made.
let rooms = {}

const newRound = (roomName, io) => {
  const room = rooms[roomName]
  // 3) When a new round starts, we intialize the boardstate object.
  const freshBoardState = {
    // these 4 objects below represent players.
    1: {team: 'red', role: 'codemaster'},
    2: {team: 'red', role: 'guesser'},
    3: {team: 'blue', role: 'codemaster'},
    4: {team: 'blue', role: 'guesser'},
    // these 4 arrays below represent the cards which have been revealed as red, blue, beige, or grey
    colors: {
      red: [],
      blue: [],
      beige: [],
      grey: []
    },
    // these 2 lines below represent the last clue that was given and who the active player is.
    currentClue: {clue: '', clueNum: 0, player: 0},
    cardsChosen: 0,
    activePlayer: 0
  }
  // run the newDeck method on the deck class (found in ../classes/deck), which shuffles the words and assigns which cards on the board will be red, blue, beige, and grey.
  room.deck.newDeck()
  // set the boardstate property of our room to be the boardstate object that we initialized above
  room.boardstate = freshBoardState
  // set the activePlayer to 1. player 1 will have the first turn.
  room.boardstate.activePlayer = 1
  // emit the 'update_boardstate' socket, which is on the Table component (client/components/Table.js), passing in the boardstate on our room that we set above.
  io.in(roomName).emit('update_boardstate', room.boardstate)
  // emit the 'gameready' socket, which is also located on the Table component. ///3
  io.in(roomName).emit('gameready')
}

module.exports = io => {
  io.on('connection', socket => {
    console.log(`User connected: ${socket.id}`)

    socket.on('sendMessage', (message, callback) => {
      io.emit('message', {text: message})

      callback()
    })

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
      // 2) if the room a user created does not yet exist, we will create a new room with that roomName, which is initialized with a new deck [required in from ../classes/deck, shown above], an empty array of players, and an empty object for the boardstate. (--> 2a)
      if (!rooms[roomName])
        rooms[roomName] = {
          deck: new deck(),
          players: [],
          boardstate: {}
        }
      // if there are less than 4 players in the room, we are not yet ready to go. We will push the person who just joined into the 'players' array of our room[roomName] object, as an object with an 'id' property and a 'player' property. The 'id' property is the person's socket id generated by the socket when they go to the page. The 'player' property is a number from 1 to 4, which we will use to identify the player.
      const players = rooms[roomName].players
      if (players.length < 4) {
        players.push({id: socket.id, player: players.length + 1})
        //Then we join the room and emit the 'joinedroom' socket, which is on the Table component (components/Table.js), passing in the room and the player.  (--> 2b)
        socket.join(roomName)
        socket.emit('joinedroom', roomName, players.length)
      }
      // if there are 4 players in the room now, we start the game by running the newRound function, defined above. ///2
      if (players.length === 4) newRound(roomName, io)
    })

    // 5) This will emit the 'codemaster view' socket, found on the Board component (components/Board.js), passing in the deck that lives on our rooms[roomName] object.
    socket.on('codemaster view', roomName => {
      socket.emit('codemaster view', rooms[roomName].deck)
    })

    // This will emit the 'guesser view' socket, also found on the Board component, but only passing in the 'words' property of the deck, and not the color information. ///5
    socket.on('guesser view', roomName => {
      socket.emit('guesser view', rooms[roomName].deck.words)
    })

    // 10) The socket below will give a clue to the room and then change the turn to the next player.
    socket.on('give clue', (roomName, clue, clueNum) => {
      // the 'player' variable used in this socket is identified as the 'player' property on the element of the 'players' array on this rooms[roomName] object whose 'id' property is the same as the socket id of the person emitting this socket. In other words, 'player' refers to the player who emitted this socket.
      const {player} = rooms[roomName].players.filter(
        client => client.id === socket.id
      )[0]
      // On the boardstate of this room, we set the currentClue based on the clue and clueNum passed in, along with the player identified above.
      rooms[roomName].boardstate.currentClue.clue = clue
      rooms[roomName].boardstate.currentClue.clueNum = clueNum
      rooms[roomName].boardstate.currentClue.player = player
      // We then change the activePlayer to the next player. (if the last activePlayer was 3, it will change to 4; if the last activePlayer was 4, it will change to 1, etc.)
      rooms[roomName].boardstate.activePlayer =
        rooms[roomName].boardstate.activePlayer % 4 + 1
      // We then emit the 'update_boardstate' socket, which is located on the Table component. This will update the currentClue and the activePlayer. ///10
      io.in(roomName).emit('update_boardstate', rooms[roomName].boardstate)
    })

    // 16) The socket below will choose a card and display the color for all players.
    // [TODO: A lot to be is yet to be done with this. A guesser should be able to guess as many cards as the 'clueNum' given by the last codemaster. If the chosen card is for the other team or is neutral, the turn should end. If the chosen card is gray, the whole game should end. The codemaster's view should also be changed to reflect which cards have been chosen already.]
    socket.on('choose card', (roomName, idx, clueNum, cardsChosen) => {
      const {player} = rooms[roomName].players.filter(
        client => client.id === socket.id
      )[0]
      const {team} = rooms[roomName].boardstate[player]
      // The 'idx' passed in is the index of the card that the guesser clicked on. We check whether it is in the 'redWordIndices' array, 'blueWordIndices' array, etc (which are properties on the 'deck' object which lives as a property of this room). If it's in the redWordIndices array, then we push that index onto the 'red' array of the 'colors' property of our boardstate. And so on for blue, beige, and grey.
      if (rooms[roomName].deck.redWordIndices.includes(idx)) {
        rooms[roomName].boardstate.colors.red.push(idx)
        if (team === 'red') {
          rooms[roomName].boardstate.cardsChosen++
        } else {
          // We change the activePlayer to the next player.
          rooms[roomName].boardstate.activePlayer =
            rooms[roomName].boardstate.activePlayer % 4 + 1
        }
        if (rooms[roomName].boardstate.cardsChosen === clueNum + 1) {
          rooms[roomName].boardstate.activePlayer =
            rooms[roomName].boardstate.activePlayer % 4 + 1
        }
      } else if (rooms[roomName].deck.blueWordIndices.includes(idx)) {
        rooms[roomName].boardstate.colors.blue.push(idx)
        if (team === 'blue') {
          rooms[roomName].boardstate.cardsChosen++
        } else {
          // We change the activePlayer to the next player.
          rooms[roomName].boardstate.activePlayer =
            rooms[roomName].boardstate.activePlayer % 4 + 1
        }
        if (rooms[roomName].boardstate.cardsChosen === clueNum + 1) {
          rooms[roomName].boardstate.activePlayer =
            rooms[roomName].boardstate.activePlayer % 4 + 1
        }
      } else if (rooms[roomName].deck.beigeWordIndices.includes(idx)) {
        rooms[roomName].boardstate.colors.beige.push(idx)
        rooms[roomName].boardstate.activePlayer =
          rooms[roomName].boardstate.activePlayer % 4 + 1
      } else {
        rooms[roomName].boardstate.colors.grey.push(idx)
        // GAME OVER. TODO: what happens when a game ends?? 'you win/you lose' popup? for now for production,
        rooms[roomName].boardstate.activePlayer =
          rooms[roomName].boardstate.activePlayer % 4 + 1
      }

      // We emit the 'update_boardstate' socket in our room, passing in the boardstate, which has now been updated with the chosen card's color and the new activePlayer. ///16
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
