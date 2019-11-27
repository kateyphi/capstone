/* eslint-disable complexity */
import React from 'react'
import Square from './Square'
import socket from '../socket'

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

    socket.on('codemaster view', deck => {
      this.setState(deck)
    })

    socket.on('guesser view', words => {
      this.setState({words})
    })

    // socket.on('choose card', )
    this.chooseCard = this.chooseCard.bind(this)
  }

  findColor(idx) {
    if (!this.props.boardstate[this.props.player]) {
      return 'white'
    }
    let role = this.props.boardstate[this.props.player].role
    let bs = this.props.boardstate.colors
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

  chooseCard(idx) {
    socket.emit('choose card', this.props.room, idx)
  }

  // Create the 5 x 5 board
  createBoard(row, col) {
    const board = []
    let cellCounter = 0

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

  renderSquare(i) {
    console.log('rendering...')
    return (
      <Square
        key={i}
        value={this.state.words[i]}
        background={this.findColor(i)}
        chooseCard={() => this.chooseCard(i)}
      />
    )
  }

  render() {
    return <div className="board">{this.createBoard(5, 5)}</div>
  }
}

export default Board
