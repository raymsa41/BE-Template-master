const express = require('express')
const bodyParser = require('body-parser')
const { sequelize } = require('./model')
const { getProfile } = require('./middleware/getProfile')
const contracts = require('./routes/contracts')
const jobs = require('./routes/jobs')
const admin = require('./routes/admin')
const balance = require('./routes/balances')
const logger = require('./utils/logger')

const app = express()
app.use(bodyParser.json())
app.set('sequelize', sequelize)
app.set('models', sequelize.models)

// top level routes
app.use('/contracts', getProfile, contracts)
app.use('/jobs', getProfile, jobs)
app.use('/balances', balance)
app.use('/admin', admin)

// Error handler middleware
// catch errors from routes
// check if it is safe to emit message to the api client
app.use((err, req, res, next) => {
	const statusCode = err.statusCode || 500
	const errorMessage =
		statusCode !== 500 ? err.message : 'Internal server error'

	logger.error(errorMessage)
	logger.error(err.stack)

	res.status(statusCode)
		.json({
			message: errorMessage,
		})
		.end()

	return
})

module.exports = app
