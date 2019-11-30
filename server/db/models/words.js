const Sequelize = require('sequelize')
const db = require('../db')

const Words = db.define('words', {
  word: {
    type: Sequelize.STRING
  }
})

module.exports = Words
