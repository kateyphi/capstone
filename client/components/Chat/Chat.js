import React from 'react'
import io from 'socket.io-client'
import socket from '../../socket'

class Chat extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      roomname: '',
      username: '',
      message: '',
      messages: []
    }

    socket.on('joinchat', (roomname, username) => {
      console.log('got to the joinchat socket!')
      this.setState({roomname, username})
    })

    // this.socket = io('localhost:3000')

    socket.on('receiveMessage', data => {
      this.addMessage(data)
    })

    this.addMessage = this.addMessage.bind(this)
    this.sendMessage = this.sendMessage.bind(this)
  }

  addMessage = data => {
    console.log(data)
    this.setState({messages: [...this.state.messages, data]})
    console.log(this.state.messages)
  }

  sendMessage = ev => {
    ev.preventDefault()
    socket.emit('sendMessage', {
      author: this.state.username,
      message: this.state.message
    })
    this.setState({message: ''})
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-4">
            <div className="card">
              <div className="card-body">
                <div className="card-title">Room: {this.state.roomname}</div>
                <hr />
                <div className="messages">
                  {this.state.messages.map(message => {
                    return (
                      <div>
                        {message.author}: {message.message}
                      </div>
                    )
                  })}
                </div>
              </div>
              <div className="card-footer">
                {/* <input
                  type="text"
                  placeholder="Name"
                  value={this.state.username}
                  onChange={ev => this.setState({username: ev.target.value})}
                  className="form-control"
                /> */}
                <br />
                <input
                  type="text"
                  placeholder="Message"
                  className="form-control"
                  value={this.state.message}
                  onChange={ev => this.setState({message: ev.target.value})}
                />
                <br />
                <button
                  onClick={this.sendMessage}
                  className="btn btn-primary form-control"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Chat
