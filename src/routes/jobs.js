const express = require('express')
const jobsController = require('../controllers/jobs')

const app = express.Router()

app.get('/unpaid', jobsController.unpaid)
app.post('/:job_id/pay', jobsController.pay)

module.exports = app