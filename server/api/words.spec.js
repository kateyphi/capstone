/* global describe beforeEach it */

const {expect} = require('chai')
const request = require('supertest')
const db = require('../db')
const app = require('../index')
const Words = db.model('words')

describe('Words routes', () => {
  beforeEach(() => {
    return db.sync({force: true})
  })

  describe('/api/words/random', () => {
    beforeEach(() => {
      return Words.create({
        word: 'puppybook'
      })
    })

    it('GET /api/words/random', async () => {
      const res = await request(app)
        .get('/api/words/random')
        .expect(200)

      expect(res.body).to.be.an('array')
    })
  }) // end describe('/api/words')
}) // end describe('Words routes')
