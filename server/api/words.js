const router = require('express').Router()
const {Words} = require('../db/models')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
module.exports = router

// GET Endpoint:  api/words/random
router.get('/random', async (req, res, next) => {
  //helper f(n) random num
  function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max))
  }
  //helper f(n) used inside of the sequelize query on line 29 in order to 'find by id' a random assortment of 25 unique words from database
  function populateSequelizeFindArray() {
    const opOrArray = []
    while (opOrArray.length < 25) {
      let randomNum = getRandomInt(661)
      if (opOrArray.indexOf(randomNum) === -1) opOrArray.push(randomNum)
    }
    return opOrArray
  }
  try {
    const words = await Words.findAll({
      where: {
        id: {
          [Op.or]: populateSequelizeFindArray()
        }
      }
    })
    res.json(words)
  } catch (err) {
    next(err)
  }
})
