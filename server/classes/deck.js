const axios = require('axios')

class deck {
  // 2a) this class creates a 'deck' which will live on our 'rooms[roomName]' object. The 'words' array contains the 25 words we've chosen. The 'redWordIndices' contains the indices of all of the Square components, which render our individual cards, that should be red. And so on with blue, beige, and grey.
  constructor() {
    this.words = []
    this.redWordIndices = []
    this.blueWordIndices = []
    this.beigeWordIndices = []
    this.greyWordIndices = []
  }

  // this method will run the shuffleWords method and the shuffleColors method below
  async newDeck() {
    console.log('in newDeck')
    this.shuffleWords()
    this.shuffleColors()
  }
  async getWords() {
    try {
      const {data} = await axios.get(`http://localhost:3000/api/words/random`)
      //  console.log(data)
      const wordArray = data.map(wordObj => {
        return wordObj.word
      })
      this.words = wordArray
    } catch (err) {
      console.log(err)
    }
  }

  // This method shuffles an array of words and populates the 'words' property of this 'deck' object with the shuffled array of words.
  // [TODO: we will need to populate the array below with a randomized selection of 25 words from our database of lots of words]
  // This method may not end up being necessary, depending on how we end up grabbing the words from database (they may already come in a random order)
  async shuffleWords() {
    // const shuffled = [
    //   'a',
    //   'b',
    //   'c',
    //   'd',
    //   'e',
    //   'f',
    //   'g',
    //   'h',
    //   'i',
    //   'j',
    //   'k',
    //   'l',
    //   'm',
    //   'n',
    //   'o',
    //   'p',
    //   'q',
    //   'r',
    //   's',
    //   't',
    //   'u',
    //   'v',
    //   'w',
    //   'x',
    //   'y'
    // ]
    // let i = 25
    // let index
    // let temp
    // while (i--) {
    //   index = Math.floor((i + 1) * Math.random())
    //   temp = shuffled[index]
    //   shuffled[index] = shuffled[i]
    //   shuffled[i] = temp
    // }
    // this.words = shuffled;
    try {
      const {data} = await axios.get(`http://localhost:3000/api/words/random`)
      console.log(data)
      const wordArray = data.map(wordObj => {
        return wordObj.word
      })
      console.log(wordArray)
      this.words = wordArray
    } catch (err) {
      console.log(err)
    }
  }

  // This method creates an array of numbers from 0 to 24, shuffled into a random order. It then takes a slice of the array and sets it as the 'redWordIndices' property on this 'deck' object. That will determine which cards on the board will be red. And so on for blue, beige, and grey. ///2a
  shuffleColors() {
    const shuffled = [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24
    ]
    let i = 25
    let index
    let temp
    while (i--) {
      index = Math.floor((i + 1) * Math.random())
      temp = shuffled[index]
      shuffled[index] = shuffled[i]
      shuffled[i] = temp
    }
    this.redWordIndices = shuffled.slice(0, 9)
    this.blueWordIndices = shuffled.slice(9, 17)
    this.beigeWordIndices = shuffled.slice(17, 24)
    this.greyWordIndices = shuffled.slice(24)
  }
}

module.exports = deck
