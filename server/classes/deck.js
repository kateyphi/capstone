class deck {
  constructor() {
    this.words = [
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
    this.redWordIndices = []
    this.blueWordIndices = []
    this.beigeWordIndices = []
    this.grayWordIndices = []
  }

  newDeck() {
    this.shuffle()
  }

  shuffle() {
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
    this.grayWordIndices = shuffled.slice(24)
  }
}

module.exports = deck
