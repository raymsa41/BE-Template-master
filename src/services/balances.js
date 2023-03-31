const Sequelize = require('sequelize')
const { Profile, Job, sequelize } = require('../model')
const CustomError = require('../utils/customError')

const deposit = async (userId, amount) => {
    // use a transaction for safely modify user balances
	const t = await sequelize.transaction()

	try {
        // use transaction on reads to have consistent reads
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

        // use increment and decrement together with a transaction 
        // instead of directly setting the value to ensure concurrency
        // and avoid race conditions
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
