const jobsService = require('../services/jobs')
const CustomError = require('../utils/customError')

const unpaid = async (req, res, next) => {
	try {
        // check for missing profile (although we should have because of auth middleware)
		if (!req.profile && !req.profile.id) {
			throw new CustomError('No profile found', 401)
		}

		const { id } = req.profile

		const { jobsReceivable, jobsPayable } =
			await jobsService.getJobsUnpaidByProfileId(id)

        // divide the missing user missing jobs in two
        // one for the jobs the user needs to pay
        // another one for the jobs the user will get payed for
		res.json({
			jobsReceivable,
			jobsPayable,
		})
	} catch (error) {
		next(error)
	}
}

const pay = async (req, res, next) => {
	try {
		const { job_id } = req.params

        // check for missing parameters
		if (!job_id) {
			throw new CustomError('No job_id sent', 400)
		}

		if (!req.profile && !req.profile.id) {
			throw new CustomError('No profile found', 401)
		}

		const { id: profileId } = req.profile

		const job = await jobsService.payJob(job_id, profileId)

		res.json({
			status: 'success',
		})
	} catch (error) {
		next(error)
	}
}

module.exports = {
	unpaid,
	pay,
}
