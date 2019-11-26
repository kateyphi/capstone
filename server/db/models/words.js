const Sequelize = require('sequelize')
const db = require('../db')

const Words = db.define('words', {
  words: {
    type: Sequelize.ARRAY
  },
  category: {
    type: Sequelize.INTEGER
  }
})

module.exports = Words
