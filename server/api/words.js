const router = require('express').Router()
const {Words} = require('../db/models')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const words = await Words.findAll()
    res.json(words)
  } catch (err) {
    next(err)
  }
})
