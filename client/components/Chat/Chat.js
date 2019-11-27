import React, {useState, useEffect} from 'react'
import socket from '../../socket'
import Input from './Input'
import Messages from '../Chat/Messages/Messages'

const Chat = props => {
  const {player, room} = props
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])

  useEffect(
    () => {
      socket.on('message', data => {
        setMessages([...messages, data])
      })

      return () => {
        socket.emit('disconnect')

        socket.off()
      }
    },
    [messages]
  )

  const sendMessage = event => {
    event.preventDefault()
    if (message) {
      socket.emit('sendMessage', message, () => setMessage(''))
    }
  }

  return (
    <div className="outerContainer">
      <div className="container">
        <Messages messages={messages} player={player} />
        <Input
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
      </div>
    </div>
  )
}

export default Chat
