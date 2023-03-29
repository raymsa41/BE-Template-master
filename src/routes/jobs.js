const express = require('express')
const jobsController = require('../controllers/jobs')

const app = express()

app.get('/unpaid', jobsController.unpaid)

module.exports = app