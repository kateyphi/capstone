import React from 'react'

function something(colorsObj, idx) {
  let chosenIndices = [
    ...colorsObj.red,
    ...colorsObj.blue,
    ...colorsObj.beige,
    ...colorsObj.grey
  ]
  console.log('indices:', chosenIndices, 'index:', idx)
  if (chosenIndices.includes(idx)) {
    return 'chosen'
  } else {
    return 'not-chosen'
  }
}

const Square = props => {
  let picked = something(props.boardstate.colors, props.chosenKey)
  //14) If the game hasn't started, render empty card.
  if (!props.currentPlayer) {
    return <div id={props.key} className="square-white" />
  }
  //if it's yourTurn and you are the guesser, you need the ability to click the board. If it's not yourTurn or you're not the guesser, you should not have that ability.
  if (props.yourTurn && props.currentPlayer.role === 'guesser') {
    return (
      // The className of this card is determined by the 'background' prop that was passed down.
      // When this card is clicked, it runs the chooseCard method back on the Board component.
      <div
        id={`square-${picked}`}
        className={`square-${props.background}`}
        onClick={props.chooseCard}
      >
        {/* The content of this div is  the value passed down, i.e. the word from the words array. ///14 */}
        {props.value}
      </div>
    )
  } else {
    return (
      <div id={`square-${picked}`} className={`square-${props.background}`}>
        {props.value}
      </div>
    )
  }
}

export default Square
