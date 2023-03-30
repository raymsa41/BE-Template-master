const adminService = require('../services/admin')
const CustomError = require('../utils/customError')

const bestProfession = async (req, res, next) => {
	try {
		const { start, end } = req.query
		const sequelize = req.app.get('sequelize')
		const bestProfession = await adminService.getBestProfession(
			sequelize,
			start,
			end
		)

		if (bestProfession.length === 0) {
			throw new CustomError('No data found', 404)
		}

		res.json({
			profession: bestProfession[0].profession,
			amount: bestProfession[0].amount,
		})
	} catch (error) {
		next(error)
	}
}

const bestClients = async (req, res, next) => {
	try {
		const { start, end, limit } = req.query
		const sequelize = req.app.get('sequelize')

		const bestClients = await adminService.getBestClients(
			sequelize,
			start,
			end,
			limit
		)

		if (bestClients.length === 0) {
			throw new CustomError('No data found', 404)
		}

		res.json(bestClients)
	} catch (error) {
		next(error)
	}
}

module.exports = {
	bestProfession,
	bestClients,
}
