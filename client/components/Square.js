import React from 'react'

const Square = props => {
  return (
    <div
      onClick={props.chooseCard}
      className={`square-${props.background}`}
      id={props.key}
    >
      {props.value}
    </div>
  )
}

export default Square
