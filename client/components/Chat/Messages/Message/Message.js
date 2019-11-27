import React from 'react'
import ReactEmoji from 'react-emoji'

const Message = ({message: {text}, player}) => {
  return (
    <div className="messageContainer justifyEnd">
      <p className="sentText pr-10">{player}</p>
      <div className="messageBox backgroundBlue">
        <p className="messageText colorWhite">{ReactEmoji.emojify(text)}</p>
      </div>
    </div>
  )
}

export default Message
