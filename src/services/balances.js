const Sequelize = require('sequelize')
const { Contract, Profile, Job } = require('../model')
const CustomError = require('../utils/customError')

const deposit = async (sequelize, userId, amount) => {
	const t = await sequelize.transaction()

	try {
		const jobsPayable = await Job.sum('price', {
			where: {
				paid: {
					[Sequelize.Op.not]: true,
				},
				'$Contract.ClientId$': userId,
			},
			include: ['Contract'],
			transaction: t,
		})

		if (jobsPayable * 0.25 < amount) {
			throw new CustomError('Invalid amount', 400)
		}

		const user = await Profile.findOne({
			where: {
				id: userId,
			},
			transaction: t,
		})

		const increment = await user.increment('balance', {
			by: amount,
			transaction: t,
		})

		t.commit()

		return jobsPayable
	} catch (error) {
		t.rollback()
		throw error
	}
}

module.exports = {
	deposit,
}
