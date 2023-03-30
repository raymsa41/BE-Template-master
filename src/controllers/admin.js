const adminService = require('../services/admin')
const CustomError = require('../utils/customError')

const bestProfession = async (req, res, next) => {
    try {
        const { start, end } = req.query
        const sequelize = req.app.get('sequelize')
        const bestProfession = await adminService.getBestProfession(sequelize, start, end)

        if (bestProfession.length === 0) {
            throw new CustomError('No data found', 404)
        }

        res.json({
            profession: bestProfession[0].profession,
            amount: bestProfession[0].amount
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
}

module.exports = {
    bestProfession
}