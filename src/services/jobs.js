const Sequelize = require('sequelize')
const { Contract, Profile, Job } = require('../model')
const { contractPublicAttributes } = require('./contracts')

const jobPublicAttributes = ['id', 'description', 'price', 'paid', 'paymentDate', 'createdAt', 'updatedAt']

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
                {
                    model: Contract,
                    attributes: contractPublicAttributes
                }
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
                {
                    model: Contract,
                    attributes: contractPublicAttributes
                }
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

module.exports = {
    getJobsUnpaidByProfileId
}