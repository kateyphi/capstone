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

    socket.on('receiveMessage', data => {
      this.addMessage(data)
    })

    this.addMessage = this.addMessage.bind(this)
    this.sendMessage = this.sendMessage.bind(this)
  }

  addMessage = data => {
    this.setState({messages: [...this.state.messages, data]})
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
            <div className="room">Room: {this.state.roomname}</div>
            <hr />
            <div className="card">
              <ScrollToBottom className="card-body">
                <div className="message">
                  {this.state.messages.map(message => {
                    return (
                      <div width="20vw" height="25vh" key={message.id}>
                        {message.author}: {message.message}
                      </div>
                    )
                  })}
                </div>
              </ScrollToBottom>
              <div className="card-footer">
                <br />
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="form-control"
                  value={this.state.message}
                  onChange={ev => this.setState({message: ev.target.value})}
                  onKeyPress={ev =>
                    ev.key === 'Enter' ? this.sendMessage(event) : null
                  }
                />
                <br />
                <button
                  type="submit"
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
