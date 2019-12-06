import React from 'react'

const TeamInfo = props => {
  if (props.active === 0) {
    return null
  } else {
    return (
      <div id="teams">
        <div id="redteam">
          <b>
            <u>Red Team</u>
          </b>
          <br />
          <b>Player 1:</b> {props.boardstate[1].playerName} ({
            props.boardstate[1].role
          })<br />
          <b>Player 2:</b> {props.boardstate[2].playerName} ({
            props.boardstate[2].role
          })<br />
          <b>Cards guessed:</b> {props.redCardsGuessed.join(', ')}
        </div>
        <div id="blueteam">
          <u>
            <b>Blue Team</b>
          </u>
          <br />
          <b>Player 3:</b> {props.boardstate[3].playerName} ({
            props.boardstate[3].role
          })<br />
          <b>Player 4:</b> {props.boardstate[4].playerName} ({
            props.boardstate[4].role
          })<br />
          <b>Cards guessed:</b> {props.blueCardsGuessed.join(', ')}
        </div>
      </div>
    )
  }
}

export default TeamInfo
