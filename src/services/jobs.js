const Sequelize = require('sequelize')
const { Contract, Profile, Job } = require('../model')
const { contractPublicAttributes } = require('./contracts')
const CustomError = require('../utils/customError')

const jobPublicAttributes = ['id', 'description', 'price', 'paid', 'paymentDate', 'createdAt', 'updatedAt']

const includeContract = {
    model: Contract,
    attributes: contractPublicAttributes
}

const getJobsUnpaidByProfileId = async (profileId) => {
    try {
        const jobsReceivable = await Job.findAll({
            where: {
                paid: {
                    [Sequelize.Op.not]: true
                },
                '$Contract.status$': {
                    [Sequelize.Op.not]: 'terminated'
                },
                '$Contract.ContractorId$': profileId
            },
            include: [
                includeContract
            ],
            attributes: jobPublicAttributes
        })

        const jobsPayable = await Job.findAll({
            where: {
                paid: {
                    [Sequelize.Op.not]: true
                },
                '$Contract.status$': {
                    [Sequelize.Op.not]: 'terminated'
                },
                '$Contract.ClientId$': profileId
            },
            include: [
                includeContract
            ],
            attributes: jobPublicAttributes
        })

        return {
            jobsReceivable,
            jobsPayable
        }
    } catch (error) {

    }
}

const payJob = async (sequelize, jobId, profileId) => {
    const t = await sequelize.transaction()

    try {
        const job = await Job.findOne({
            where: {
                id: jobId,
                '$Contract.ClientId$': profileId
            },
            include: {
                all: true
            },
            transaction: t
        })

        if (!job) {
            throw new CustomError('Job not found', 404)
        }

        if (job.paid) {
            throw new CustomError('Job already paid', 401)
        }
        
        const contract = await Contract.findOne({
            where: {
                id: job.ContractId
            },
            include: ['Contractor', 'Client'],
            transaction: t
        })
        const contractor = contract.Contractor
        const client = contract.Client

        if (client.balance - job.price < 0) {
            throw new CustomError('Insufficient funds', 401)
        }

        const decrement = await client.decrement(
            'balance',
            { 
                by: job.price,
                transaction: t
            },
        )
        const increment = await contractor.increment(
            'balance', 
            {
                by: job.price,
                transaction: t
            }
        )

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
    payJob
}