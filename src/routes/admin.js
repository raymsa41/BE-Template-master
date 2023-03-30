const express = require('express')
const adminController = require('../controllers/admin')

const app = express.Router()

app.get('/best-profession', adminController.bestProfession)

module.exports = app