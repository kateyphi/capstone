/* eslint-disable complexity */
import React from 'react'
import socket from '../socket'
import Swal from 'sweetalert2'

export default class Hand extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      roomPlayers: [],
      clue: '',
      clueNum: '',
      clicked: 0
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
    if (this.state.clue === '' || this.state.clueNum === '') {
      evt.preventDefault()
      Swal.fire({
        title: 'Input Error',
        text: 'Clue and Number fields cannot be blank',
        icon: 'info'
      })
      return false
    }
    if (this.state.clue.includes(' ')) {
      evt.preventDefault()
      Swal.fire({
        title: 'Input Error',
        text: 'Clues should only be one word',
        icon: 'info'
      })
      return false
    }
    if (this.state.clue.includes('_')) {
      evt.preventDefault()
      Swal.fire({
        title: 'Input Error',
        text: 'Underscores are the cousins of spaces...',
        icon: 'info'
      })
      return false
    }
    if (this.state.clue.length > '15') {
      evt.preventDefault()
      Swal.fire({
        title: 'Hmm...',
        text: 'Your clue is a bit long...',
        icon: 'info'
      })
      return false
    }
    if (this.state.clueNum < 1 || this.state.clueNum > 9) {
      evt.preventDefault()
      Swal.fire({
        title: 'Input Error',
        text: 'Number must be between 1-9',
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
        <div className="elegant-shadow" id="hand-bottom">
          {'  '}
          <b>
            Welcome to Codewords! Create or join a game on the left panel.
          </b>{' '}
        </div>
      )
    }
    if (this.props.active === 0) {
      return (
        <div className="elegant-shadow" id="hand-bottom">
          You are in the room {this.props.room}.<br />
        </div>
      )
    }
    if (this.props.yourTurn) {
      //play a sound if it's your turn you're the codemaster
      if (this.props.yourTurn && this.state.clue === '') {
        let audio = new Audio(
          'http://soundbible.com/mp3/sms-alert-1-daniel_simon.mp3'
        )
        audio.play()
      }
      // if it's your turn and you are the codemaster, this component will render the form asking for a clue and a number. Those appear on state in real time via the handleChange method above. When submitted, it runs the giveClue method. ///8
      if (this.props.boardstate[this.props.player].role === 'codemaster') {
        return (
          <div className="elegant-shadow" id="hand-bottom">
            <text style={{fontSize: 30}}>
              <b>It's your turn: </b> Please submit a one-word clue, and a
              number of cards that correspond to that clue:
            </text>
            <br />
            <form id="give-clue" onSubmit={this.giveClue}>
              <text
                style={{
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: 20,
                  paddingRight: 5
                }}
              >
                Clue:
              </text>
              <input
                id="input-clue"
                style={{width: 300}}
                name="clue"
                type="text"
                autoComplete="off"
                onChange={this.handleChange}
                value={this.state.clue}
              />
              <text
                style={{
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: 20,
                  paddingLeft: 10,
                  paddingRight: 15
                }}
              >
                Number:
              </text>
              <input
                style={{width: 100}}
                id="input-clue"
                name="clueNum"
                type="text"
                autoComplete="off"
                onChange={this.handleChange}
                value={this.state.clueNum}
              />{' '}
              <button
                className="btn"
                type="submit"
                style={{marginLeft: 5, fontSize: 16}}
              >
                Submit
              </button>
            </form>
          </div>
        )
      } else {
        if (this.state.clicked === 0) {
          console.log('hi')
          let audio = new Audio(
            'http://soundbible.com/mp3/sms-alert-1-daniel_simon.mp3'
          )
          audio.play()
          this.setState({
            clicked: 1
          })
        }
        let audio = new Audio(
          'http://soundbible.com/mp3/sms-alert-1-daniel_simon.mp3'
        )
        audio.play()
        // 11) if it's your turn and you are the guesser, then this component will render what the latest clue and number was, and ask you to select your guesses (by clicking on cards on the Board component) ///11
        return (
          <div className="elegant-shadow" id="hand-bottom">
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
            <button className="btn" type="button" onClick={this.handleClick}>
              Done
            </button>
          </div>
        )
      }
    }
    if (this.props.active === 1 || this.props.active === 3) {
      return (
        <div className="elegant-shadow" id="hand-bottom">
          Waiting for {this.props.currentPlayer.team}{' '}
          {this.props.currentPlayer.role} to submit clue...
        </div>
      )
    } else {
      return (
        <div className="elegant-shadow" id="hand-bottom">
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
