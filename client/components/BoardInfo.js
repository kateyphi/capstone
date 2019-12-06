import React from 'react'

const BoardInfo = props => {
  if (props.active === 0) {
    return null
  } else if (props.active === 1 || props.active === 3) {
    return (
      <div id="board-info">
        <b>Current Turn:</b> {props.boardstate[props.active].playerName} is
        thinking of a clue.
      </div>
    )
  } else {
    return (
      <div id="board-info">
        <b>Current Turn:</b> {props.boardstate[props.active].playerName} is
        guessing cards:<br />
        <b>Clue Given:</b> {props.boardstate.currentClue.clue} for{' '}
        {props.boardstate.currentClue.clueNum}
        <br />
        <b>Cards guessed:</b> {props.boardstate.cardsChosen}{' '}
        <b>Guesses left:</b>{' '}
        {props.boardstate.currentClue.clueNum -
          props.boardstate.cardsChosen +
          1}
      </div>
    )
  }
}
export default BoardInfo
