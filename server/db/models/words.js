const Sequelize = require('sequelize')
const db = require('../db')

const Words = db.define('words', {
  words: {
    type: Sequelize.ARRAY(Sequelize.TEXT)
  },
  category: {
    type: Sequelize.INTEGER
  }
})

module.exports = Words
