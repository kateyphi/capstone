import React from 'react'

const Nickname = props => {
  return (
    <div>
      Welcome to CodeWords! Please enter a nickname below to identify yourself.
      <br />
      <form onSubmit={props.handleSubmit}>
        <label>Nickname:</label>
        <input
          name="nickname"
          type="text"
          autoComplete="off"
          onChange={props.handleChange}
          value={props.nickname}
        />
        <button type="submit">Join</button>
      </form>
    </div>
  )
}

export default Nickname
