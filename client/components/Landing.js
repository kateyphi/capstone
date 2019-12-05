import React from 'react'
import socket from '../socket'
import Swal from 'sweetalert2'

class Landing extends React.Component {
  constructor() {
    super()
    this.state = {
      name: '',
      room: ''
    }
  }

  handleChange(evt) {
    this.setState({
      [evt.target.name]: evt.target.value
    })
  }

  handleSubmit() {
    if (this.state.name === '') {
      Swal.fire('Please enter a nickname to join.')
    } else if (this.state.room === '') {
        socket.emit('joinroom', 'lobby', this.state.name)
      } else {
        socket.emit('joinroom', this.state.room, this.state.name)
      }
  }
  render() {
    return (
      <div>
        Welcome to CodeWords! Please enter a nickname below to identify
        yourself.<br />
        If you already know the name of game room you'd like to join, enter that
        as well. If you do not enter a room name, you will be taken to the Lobby
        where you can view open rooms or create your own.
        <form onSubmit={this.handleSubmit}>
          <label>Nickname:</label>
          <input
            name="name"
            type="text"
            autoComplete="off"
            onChange={this.handleChange}
            value={this.state.name}
          />
          <label>Room (optional):</label>
          <input
            name="name"
            type="text"
            autoComplete="off"
            onChange={this.handleChange}
            value={this.state.name}
          />
          <button type="submit">Let's go play Codewords!</button>
        </form>
      </div>
    )
  }
}
