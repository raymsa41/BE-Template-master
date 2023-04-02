const Sequelize = require('sequelize')
const { Contract, Job, sequelize } = require('../model')
const { contractPublicAttributes } = require('./contracts')
const CustomError = require('../utils/customError')

const jobPublicAttributes = [
	'id',
	'description',
	'price',
	'paid',
	'paymentDate',
	'createdAt',
	'updatedAt',
]

const includeContract = {
	model: Contract,
	attributes: contractPublicAttributes,
}

const getJobsUnpaidByProfileId = async (profileId) => {
	try {
		const jobsReceivable = await Job.findAll({
			where: {
				paid: {
					[Sequelize.Op.not]: true,
				},
				'$Contract.status$': {
					[Sequelize.Op.not]: 'terminated',
				},
				'$Contract.ContractorId$': profileId,
			},
			include: [includeContract],
			attributes: jobPublicAttributes,
		})

		const jobsPayable = await Job.findAll({
			where: {
				paid: {
					[Sequelize.Op.not]: true,
				},
				'$Contract.status$': {
					[Sequelize.Op.not]: 'terminated',
				},
				'$Contract.ClientId$': profileId,
			},
			include: [includeContract],
			attributes: jobPublicAttributes,
		})

		return {
			jobsReceivable,
			jobsPayable,
		}
	} catch (error) {}
}

const payJob = async (jobId, profileId) => {
    // use a transaction for safely modify multiple tables
	const t = await sequelize.transaction()

	try {
        // use transactions on reads to have consistent reads
        // warning: This can still led to logical race conditions depending on the level of isolation
        // Isolation level needs to be set to Serializable
        // Or use Select for update to lock the row
		const job = await Job.findOne({
			where: {
				id: jobId,
				'$Contract.ClientId$': profileId,
			},
			include: {
				all: true,
			},
			transaction: t,
		})

        // check for missing parameters
		if (!job) {
			throw new CustomError('Job not found', 404)
		}

        // only let the user pay the job 1 time
		if (job.paid) {
			throw new CustomError('Job already paid', 401)
		}

		const contract = await Contract.findOne({
			where: {
				id: job.ContractId,
			},
			include: ['Contractor', 'Client'],
			transaction: t,
		})
		const contractor = contract.Contractor
		const client = contract.Client

		if (client.balance - job.price < 0) {
			throw new CustomError('Insufficient funds', 401)
		}

        // use increment and decrement together with a transaction 
        // instead of directly setting the value to ensure concurrency
        // and avoid race conditions
		const decrement = await client.decrement('balance', {
			by: job.price,
			transaction: t,
		})
		const increment = await contractor.increment('balance', {
			by: job.price,
			transaction: t,
		})

		job.paid = true
		job.paymentDate = new Date()
		await job.save({ transaction: t })

		t.commit()

		return job
	} catch (error) {
		t.rollback()
		throw error
	}
}

module.exports = {
	getJobsUnpaidByProfileId,
	payJob,
}
