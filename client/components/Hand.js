import React from 'react'
import socket from '../socket'
import Swal from 'sweetalert2'

export default class Hand extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      roomPlayers: [],
      clue: '',
      clueNum: ''
    }

    socket.on('update players in room', username => {
      this.setState({roomPlayers: [...this.state.roomPlayers, username]})
    })
    this.handleChange = this.handleChange.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.giveClue = this.giveClue.bind(this)
  }

  // 9) This method emits the 'give clue' socket, which is found in server/socket/index.js, passing in our room (which was passed down as props), the given clue (found on state), and the given number (found on state). ///9
  giveClue = evt => {
    evt.preventDefault()
    if (
      this.state.clue === '' ||
      this.state.clueNum === '' ||
      this.state.clueNum < 1 ||
      this.state.clueNum > 9
    ) {
      evt.preventDefault()
      Swal.fire({
        title: 'Input Error',
        text: 'Clue cannot be empty. Number must be between 1-9',
        icon: 'info'
      })
      return false
    } else {
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
    if (this.props.room === '') {
      return (
        <div id="hand-bottom">
          {'  '}
          <b>
            Welcome to CodeWords! Create or join a game on the left panel.
          </b>{' '}
        </div>
      )
    }
    if (this.props.active === 0) {
      return (
        <div id="hand-bottom">
          You are in the room {this.props.room}.<br />
          In {this.props.room}:{' '}
          {this.state.roomPlayers.map(player => (
            <span>
              {player}
              {','}
            </span>
          ))}
        </div>
      )
    }
    if (this.props.yourTurn) {
      // if it's your turn and you are the codemaster, this component will render the form asking for a clue and a number. Those appear on state in real time via the handleChange method above. When submitted, it runs the giveClue method. ///8
      if (this.props.boardstate[this.props.player].role === 'codemaster') {
        return (
          <div id="hand-bottom">
            <p>
              <b>It's your turn: </b> Please submit a one-word clue, and a
              number of cards that correspond to that clue:
            </p>

            <form id="give-clue" onSubmit={this.giveClue}>
              <h5 htmlFor="clue" style={{color: 'black', fontWeight: 'bold'}}>
                Clue:
              </h5>
              <input
                name="clue"
                type="text"
                autoComplete="off"
                onChange={this.handleChange}
                value={this.state.clue}
              />
              <h5 htmlFor="clue" style={{color: 'black', fontWeight: 'bold'}}>
                Number:
              </h5>
              <input
                name="clueNum"
                type="text"
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
            <b>It's your turn: </b> Your codemaster gave the clue{' '}
            <text style={{fontWeight: 'bold'}}>
              {this.props.currentClue.clue}
            </text>{' '}
            for{' '}
            <text style={{fontWeight: 'bold'}}>
              {this.props.currentClue.clueNum}
            </text>
            . Please select up to {this.props.currentClue.clueNum + 1} guesses.
            If you want to select less than that, press the "Done" button to end
            your turn.
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
          <text style={{fontWeight: 'bold'}}>
            {this.props.currentClue.clue}
          </text>{' '}
          for{' '}
          <text style={{fontWeight: 'bold'}}>
            {this.props.currentClue.clueNum}
          </text>
          . Waiting for the {this.props.currentPlayer.team}{' '}
          {this.props.currentPlayer.role} to submit their guesses.
        </div>
      )
    }
  }
}
