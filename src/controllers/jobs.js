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
        console.log(error)
        next(error)
    }
}

module.exports = {
    unpaid
}