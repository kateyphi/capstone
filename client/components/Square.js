import React from 'react'

const Square = props => {
  return <div className={`square-${props.background}`}>{props.value}</div>
}

export default Square
