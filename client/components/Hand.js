import React from 'react'
import socket from '../socket'

export default class Hand extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      clue: '',
      clueNum: ''
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.giveClue = this.giveClue.bind(this)
  }

  // 9) This method emits the 'give clue' socket, which is found in server/socket/index.js, passing in our room (which was passed down as props), the given clue (found on state), and the given number (found on state). ///9
  giveClue = evt => {
    evt.preventDefault()
    socket.emit(
      'give clue',
      this.props.room,
      this.props.player,
      this.state.clue,
      +this.state.clueNum
    )
    this.setState({
      clue: '',
      clueNum: ''
    })
  }

  handleChange(evt) {
    this.setState({
      [evt.target.name]: evt.target.value
    })
  }

  handleClick() {
    socket.emit('change turn', this.props.room)
  }
  // 8) This component renders the sentences that appear under the board.
  render() {
    //if there's no active player yet (i.e. the game hasn't started)
    if (this.props.active === 0) {
      return <div id="hand-bottom">Waiting for game to begin.</div>
    }
    if (this.props.yourTurn) {
      // if it's your turn and you are the codemaster, this component will render the form asking for a clue and a number. Those appear on state in real time via the handleChange method above. When submitted, it runs the giveClue method. ///8
      if (this.props.boardstate[this.props.player].role === 'codemaster') {
        return (
          <div>
            <h5>
              {' '}
              You are the {this.props.boardstate[this.props.player].team}{' '}
              Codemaster
            </h5>
            <form id="give-clue" onSubmit={this.giveClue}>
              <label htmlFor="clue">Clue:</label>
              <input
                name="clue"
                type="text"
                autoComplete="off"
                onChange={this.handleChange}
                value={this.state.clue}
              />
              <label htmlFor="clue">Number:</label>
              <input
                name="clueNum"
                type="number"
                autoComplete="off"
                onChange={this.handleChange}
                value={this.state.clueNum}
              />
              <button type="submit">Submit</button>
            </form>
          </div>
        )
      } else {
        // 11) if it's your turn and you are the guesser, then this component will render what the latest clue and number was, and ask you to select your guesses (by clicking on cards on the Board component) ///11
        return (
          <div id="hand-bottom">
            Your codemaster gave the clue {this.props.currentClue.clue} for{' '}
            {this.props.currentClue.clueNum}. Please select up to{' '}
            {this.props.currentClue.clueNum + 1} guesses. If you want to select
            less than that, press the "Done" button to end your turn.
            <button type="button" onClick={this.handleClick}>
              Done
            </button>
          </div>
        )
      }
    }
    if (this.props.active === 1 || this.props.active === 3) {
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
          {this.props.currentClue.clue} for {this.props.currentClue.clueNum}.
          Waiting for the {this.props.currentPlayer.team}{' '}
          {this.props.currentPlayer.role} to submit their guesses.
        </div>
      )
    }
  }
}
