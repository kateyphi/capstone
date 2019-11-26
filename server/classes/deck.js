class deck {
  constructor() {
    this.words = []
    this.redWordIndices = []
    this.blueWordIndices = []
    this.beigeWordIndices = []
    this.greyWordIndices = []
  }

  newDeck() {
    console.log('in newDeck')
    this.shuffleWords()
    this.shuffleColors()
  }

  // will need to populate the array below with a randomized selection of 25 words.
  shuffleWords() {
    const shuffled = [
      'a',
      'b',
      'c',
      'd',
      'e',
      'f',
      'g',
      'h',
      'i',
      'j',
      'k',
      'l',
      'm',
      'n',
      'o',
      'p',
      'q',
      'r',
      's',
      't',
      'u',
      'v',
      'w',
      'x',
      'y'
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
    this.words = shuffled
  }
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
