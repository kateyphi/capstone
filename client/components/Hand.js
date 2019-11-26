import React from 'react'
import socket from '../socket'

export default class Hand extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      clue: ''
    }
    this.handleChange = this.handleChange.bind(this)
    this.giveClue = this.giveClue.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }

  giveClue = evt => {
    evt.preventDefault()
    socket.emit('give clue', this.props.room, this.state.clue)
  }

  handleChange(evt) {
    this.setState({
      [evt.target.name]: evt.target.value
    })
  }

  handleClick() {
    socket.emit('change turn', this.props.room)
  }

  render() {
    const yourTurn = this.props.active === this.props.player
    if (yourTurn) {
      if (this.props.boardstate[this.props.player].role === 'codemaster') {
        return (
          <form id="give-clue" onSubmit={this.giveClue}>
            <label htmlFor="clue">Clue:</label>
            <input
              name="clue"
              type="text"
              autoComplete="off"
              onChange={this.handleChange}
              value={this.state.clue}
            />
            <button type="submit">Submit</button>
          </form>
        )
      } else {
        return (
          <div id="hand-bottom">
            Your codemaster gave the clue {this.props.currentClue.clue} Please
            select your guesses.{' '}
            <button type="button" onClick={this.handleClick}>
              Change turn
            </button>
          </div>
        )
      }
    } else if (this.props.active === 0) {
      return <div id="hand-bottom">Waiting for game to begin.</div>
    } else if (this.props.active === 1 || this.props.active === 3) {
      return (
        <div id="hand-bottom">
          Waiting for {this.props.currentPlayer.team}{' '}
          {this.props.currentPlayer.role} to submit clue...
        </div>
      )
    } else {
      return (
        <div id="hand-bottom">
          Player {this.props.currentClue.player} gave the clue{' '}
          {this.props.currentClue.clue} Waiting for{' '}
          {this.props.currentPlayer.team} {this.props.currentPlayer.role} to
          submit their guesses.
        </div>
      )
    }
  }
}
