import React from 'react'
import PlayerView from './Hand'
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
        currentClue: {clue: '', player: 0},
        activePlayer: 0
      }
    }

    socket.on('joinedroom', (room, player) => {
      this.setState({room, player})
      console.log(
        `Joined room ${this.state.room} as player ${this.state.player}`
      )
    })

    socket.on('gameready', () => {
      if (this.state.boardstate[this.state.player].role === 'codemaster') {
        socket.emit('codemaster view', this.state.room)
      } else {
        socket.emit('guesser view', this.state.room)
      }
    })

    socket.on('update_boardstate', boardstate => {
      this.setState({boardstate})
    })
  }

  render() {
    return (
      <div className="table">
        <Board
          boardstate={this.state.boardstate}
          room={this.state.room}
          player={this.state.player}
          active={this.state.boardstate.activePlayer}
          currentClue={this.state.currentClue}
        />
        <PlayerView
          room={this.state.room}
          player={this.state.player}
          active={this.state.boardstate.activePlayer}
          currentClue={this.state.boardstate.currentClue}
          boardstate={this.state.boardstate}
          currentPlayer={
            this.state.boardstate[this.state.boardstate.activePlayer]
          }
        />

        <Chat />
      </div>
    )
  }
}
