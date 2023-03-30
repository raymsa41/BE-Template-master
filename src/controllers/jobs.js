const jobsService = require('../services/jobs')
const CustomError = require('../utils/customError')

const unpaid = async (req, res, next) => {
    try {
        if (!req.profile && !req.profile.id) {
            throw new CustomError('No profile found', 401)
        }

        const { id } = req.profile

        const { jobsReceivable, jobsPayable } = await jobsService.getJobsUnpaidByProfileId(id)

        res.json({
            jobsReceivable,
            jobsPayable
        })
    } catch (error) {
        next(error)
    }
}

const pay = async (req, res, next) => {
    try {
        const { job_id } = req.params
        const sequelize = req.app.get('sequelize')

        if (!job_id) {
            throw new CustomError('No job_id sent', 400)
        }

        if (!req.profile && !req.profile.id) {
            throw new CustomError('No profile found', 401)
        }

        const { id: profileId } = req.profile

        const job = await jobsService.payJob(sequelize, job_id, profileId)

        res.json({
            status: 'success'
        })

    } catch (error) {
        next(error)
    }
}

module.exports = {
    unpaid,
    pay
}