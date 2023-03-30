const balanceService = require('../services/balances')
const CustomError = require('../utils/customError')

const deposit = async (req, res, next) => {
    try {
        const { userId } = req.params
        const { amount } = req.body
        const sequelize = req.app.get('sequelize')

        if (!userId) {
            throw new CustomError('No user id sent', 400)
        }

        if (!amount) {
            throw new CustomError('No amount sent', 400)
        }

        const balance = await balanceService.deposit(sequelize, userId, amount)

        res.json({
            status: 'success'
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
}

module.exports = {
    deposit
}