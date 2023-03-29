const contractService = require('../services/contracts')
const CustomError = require('../utils/customError')

const get = async (req, res, next) => { 
    try {
        const { id } = req.params

        if (!req.profile && !req.profile.id) {
            throw new CustomError('No profile found', 401)
        }

        const { id: profileId } = req.profile

        const contract = await contractService.getById(id, profileId)

        if (!contract) {
            throw new CustomError('Contract not found', 404)
        }

        res.json(contract)
    } catch (error) {
        next(error)
    }
}

const list = async (req, res, next) => {
    try {
        if (!req.profile && !req.profile.id) {
            throw new CustomError('No profile found', 401)
        }

        const { id } = req.profile

        const contracts = await contractService.getListByProfileId(id)

        res.json(contracts)
    } catch (error) {
        console.log(error)
        next(error)
    }
}

module.exports = {
    list,
    get
}