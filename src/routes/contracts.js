const express = require('express')
const contracts = require('../controllers/contracts')

const app = express()

app.use('/:id', contracts.get)
app.use('/', contracts.list)

module.exports = app