const express = require('express')
const contracts = require('../controllers/contracts')

const app = express.Router()

app.use('/:id', contracts.get)
app.use('/', contracts.list)

module.exports = app
