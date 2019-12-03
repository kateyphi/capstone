import React from 'react'
import ScrollToBottom from 'react-scroll-to-bottom'
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
      this.setState({messages: []})
    })

    // this.socket = io('localhost:3000')

    socket.on('receiveMessage', data => {
      this.addMessage(data)
    })

    this.addMessage = this.addMessage.bind(this)
    this.sendMessage = this.sendMessage.bind(this)
  }

  addMessage = data => {
    this.setState({messages: [...this.state.messages, data]})
    if (this.state.messages.length > 10) return this.state.messages.shift()
  }

  sendMessage = ev => {
    ev.preventDefault()
    socket.emit('sendMessage', this.state.roomname, {
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
                <div className="room">Room: {this.state.roomname}</div>
                <hr />
                <div className="message">
                  {this.state.messages.map(message => {
                    return (
                      <ScrollToBottom key={message.id}>
                        {message.author}: {message.message}
                      </ScrollToBottom>
                    )
                  })}
                </div>
              </div>
              <div className="card-footer">
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
                  type="submit"
                  onClick={this.sendMessage}
                  className="btn"
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
