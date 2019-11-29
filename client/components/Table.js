import React from 'react'
import Hand from './Hand'
import Board from './Board'
import socket from '../socket'
import Chat from './Chat/Chat'

export default class Table extends React.Component {
  constructor() {
    super()
    this.state = {
      room: '',
      player: 99,
      boardstate: {
        1: {team: 'red', role: 'codemaster'},
        2: {team: 'red', role: 'guesser'},
        3: {team: 'blue', role: 'codemaster'},
        4: {team: 'blue', role: 'guesser'},
        colors: {
          red: [],
          blue: [],
          beige: [],
          grey: []
        },
        currentClue: {clue: '', clueNum: 0, player: 0},
        cardsChosen: 0,
        activePlayer: 0
      }
    }

    // 2b) This socket takes in the room and the player, and puts them on state. To clarify, the 'player' property on state will refer to the player who is viewing this component. It is specific to each person in the game. ///2b
    socket.on('joinedroom', (room, player) => {
      this.setState({room, player})
      console.log(
        `Joined room ${this.state.room} as player ${this.state.player}`
      )
    })

    // 4) The state that is governing most of what the players see is on this component. When this socket below is emitted, passing in an updated boardstate, it updates the state on this component.
    socket.on('update_boardstate', boardstate => {
      this.setState({boardstate})
    })

    // If the current player's role is 'codemaster', we will emit the 'codemaster view' socket, which is located in server/socket/index.js. If their role is 'guesser', we will emit the 'gueser view' socket. These will effect how the boards render for different views. ///4
    socket.on('gameready', () => {
      if (this.state.boardstate[this.state.player].role === 'codemaster') {
        socket.emit('codemaster view', this.state.room)
      } else {
        socket.emit('guesser view', this.state.room)
      }
    })
  }

  // 7) This component renders the Board component and the Hand component. If the player is a codemaster, they will complete their turn in the "Hand" component. If the player is a guesser, they will complete their turn in the "Board" component. ///7
  render() {
    // it's yourTurn if the active player matches the player viewing this component.
    let yourTurn = this.state.boardstate.activePlayer === this.state.player
    return (
      <div className="table">
        <Hand
          room={this.state.room}
          player={this.state.player}
          active={this.state.boardstate.activePlayer}
          currentClue={this.state.boardstate.currentClue}
          boardstate={this.state.boardstate}
          currentPlayer={
            this.state.boardstate[this.state.boardstate.activePlayer]
          }
          yourTurn={yourTurn}
        />
        <Board
          boardstate={this.state.boardstate}
          room={this.state.room}
          player={this.state.player}
          currentPlayer={
            this.state.boardstate[this.state.boardstate.activePlayer]
          }
          yourTurn={yourTurn}
          clueNum={this.state.boardstate.currentClue.clueNum}
          cardsChosen={this.state.boardstate.cardsChosen}
        />
        <div className="chat">
          <Chat player={this.state.player} room={this.state.room} />
        </div>
      </div>
    )
  }
}
