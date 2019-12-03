import React from 'react'

const UserInfo = props => {
  if (props.active === 0) {
    return null
  } else {
    return (
      <div id="user-info">
        <div>
          <span className="info-labels">Name: </span> {` ${props.playerName} `}
        </div>
        <div>
          <span className="info-labels"> Player #: </span> {` ${props.player} `}{' '}
        </div>
        <div>
          <span className="info-labels"> Team: </span>{' '}
          <span className={`info-${props.playerInfo.team}`}>{` ${
            props.playerInfo.team
          } `}</span>{' '}
        </div>
        <div>
          <span className="info-labels"> Role: </span>{' '}
          {` ${props.playerInfo.role} `}
        </div>
      </div>
    )
  }
}

export default UserInfo
