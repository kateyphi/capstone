/* eslint-disable complexity */
import React from 'react'
import Square from './Square'
import socket from '../socket'
const Swal = require('sweetalert2')

class Board extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      words: [],
      redWordIndices: [],
      blueWordIndices: [],
      beigeWordIndices: [],
      greyWordIndices: []
    }

    // 6) This socket takes in this room's deck and sets the state on this component with that deck. This only would have been triggered if the player was a codemaster, so the codemaster gets all the information about which cards are which color.
    socket.on('codemaster view', deck => {
      this.setState(deck)
    })

    // This socket just takes in the room's deck's 'words' property, and sets it on state for this component. It would be triggered if the player were a guesser, so they won't get information about the colors of the cards. ///6
    socket.on('guesser view', words => {
      this.setState({words})
    })
    socket.on('win', winner => {
      console.log(winner)
      Swal.fire({
        title: 'GAME OVER!',
        text: `${winner}`,
        icon: 'info',
        confirmButtonText: 'Cool'
      })
    })

    this.chooseCard = this.chooseCard.bind(this)
  }

  findColor(idx) {
    // 13a) this first 'if' statement is meant to handle before the game has started. There may be a cleaner way to do so.
    if (!this.props.boardstate[this.props.player]) {
      return 'white'
    }
    let role = this.props.boardstate[this.props.player].role
    let bs = this.props.boardstate.colors
    // If the role of the player viewing this component is 'guesser', then we will look at the boardstate passed down from the 'Table' component to determine the color. This should reflect the revealed colors of the cards that have been guessed already. We check whether each array contains the index passed into this method, and if it does, return the color associated with that array. If it's not associated with any of those, it returns 'white'.
    if (role === 'guesser') {
      if (bs.red.includes(idx)) {
        return 'red'
      } else if (bs.blue.includes(idx)) {
        return 'blue'
      } else if (bs.beige.includes(idx)) {
        return 'beige'
      } else if (bs.grey.includes(idx)) {
        return 'grey'
      } else {
        return 'white'
      }
      // If the player's role is not guesser (then it must be codemaster), we will instead look at the state on this component to determine the color. Recall that this state was populated with the redWordIndices, blueWordIndices, etc, when the game started (on the 'gameready' / 'codemaster view' sockets). ///13a
    } else if (this.state.redWordIndices.includes(idx)) {
      return 'red'
    } else if (this.state.blueWordIndices.includes(idx)) {
      return 'blue'
    } else if (this.state.beigeWordIndices.includes(idx)) {
      return 'beige'
    } else if (this.state.greyWordIndices.includes(idx)) {
      return 'grey'
    } else {
      return 'white'
    }
  }

  // 15) This method emits the 'choose card' socket, found in server/socket/index.js, passing in the room and the index of the word in the 'words' array on state. ///15
  chooseCard(idx) {
    socket.emit(
      'choose card',
      this.props.room,
      this.props.player,
      idx,
      this.props.clueNum,
      this.props.cardsChosen
    )
    this.checkWinner()
  }

  checkWinner() {
    socket.emit('check winner', this.props.room)
  }

  // Create the 5 x 5 board
  createBoard(row, col) {
    const board = []
    let cellCounter = 0

    // 12) A grid is created, where each element is created by the renderSquare method, passing in the numbers 0 through 24, respectively. ///12
    for (let i = 0; i < row; i += 1) {
      const columns = []
      for (let j = 0; j < col; j += 1) {
        columns.push(this.renderSquare(cellCounter++))
      }
      board.push(
        <div key={i} className="board-row">
          {columns}
        </div>
      )
    }

    return board
  }

  // 13) This will render a Square component, passing down certain props...
  renderSquare(i) {
    let index = i
    return (
      <Square
        //Each square has a 'key' prop, a number from 0 to 24, which was passed into this method.
        chosenKey={index}
        //Each square's value is the word at that index in the 'words' array on state.
        value={this.state.words[i]}
        //Each square's 'background' prop is found by the findColor method above (-->13a)
        background={this.findColor(i)}
        //We must pass down the chooseCard method, which handles choosing a card as the player's turn. ///13
        chooseCard={() => this.chooseCard(i)}
        yourTurn={this.props.yourTurn}
        currentPlayer={this.props.currentPlayer}
        boardstate={this.props.boardstate}
      />
    )
  }

  render() {
    return <div className="board">{this.createBoard(5, 5)}</div>
  }
}

export default Board
