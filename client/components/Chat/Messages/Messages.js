import React from 'react'

import Message from './Message/Message'

const Messages = ({messages, player}) => (
  <div className="messages">
    {messages.map((message, i) => (
      <div key={i}>
        <Message message={message} player={player} />}
      </div>
    ))}
  </div>
)

export default Messages
