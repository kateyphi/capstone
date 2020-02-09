import React from 'react'
import socket from '../socket'
import Swal from 'sweetalert2'
import Chat from './Chat/Chat'
import Sidebar from './Sidebar'
import Nickname from './Nickname'

class Landing extends React.Component {
  constructor() {
    super()
    this.state = {
      nickname: '',
      hasName: false
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(evt) {
    this.setState({
      [evt.target.name]: evt.target.value
    })
  }

  handleSubmit(evt) {
    evt.preventDefault()
    if (this.state.nickname === '') {
      Swal.fire('Please enter a nickname to join.')
    } else {
      socket.emit('joinroom', 'lobby', this.state.nickname)
    }
    this.setState({
      nickname: '',
      hasName: true
    })
  }
  render() {
    return (
      <div>
        {!this.state.hasName && (
          <Nickname
            handleChange={this.handleChange}
            handleSubmit={this.handleSubmit}
            nickname={this.state.nickname}
          />
        )}
        <Sidebar />
        <Chat />
      </div>
    )
  }
}

export default Landing
