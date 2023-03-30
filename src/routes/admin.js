const express = require('express')
const adminController = require('../controllers/admin')

const app = express.Router()

app.get('/best-profession', adminController.bestProfession)
app.get('/best-clients', adminController.bestClients)

module.exports = app
