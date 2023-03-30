const express = require('express')
const balanceController = require('../controllers/balances')

const app = express.Router()

app.post('/deposit/:userId', balanceController.deposit)

module.exports = app
