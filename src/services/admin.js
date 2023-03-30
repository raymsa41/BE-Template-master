const Sequelize = require('sequelize')
const CustomError = require('../utils/customError')
const { Profile, Contract, Job } = require('../model')

const getBestProfession = async (sequelize, start, end) => {
    try {
        if (!start || !end) {
            throw new CustomError('Missing start or end date', 400)
        }

        const bestProfession = await sequelize.query(
            `
                SELECT
                    profile.id,
                    profile.firstName,
                    profile.lastName,
                    profile.profession,
                    profile.createdAt,
                    profile.updatedAt,
                    SUM(job.price) AS amount
                FROM
                    profiles AS profile
                LEFT JOIN
                    contracts AS contract ON contract.ContractorId = profile.id
                LEFT JOIN
                    jobs AS job ON job.ContractId = contract.id
                WHERE
                    job.paid = true
                AND
                    job.paymentDate BETWEEN :start AND :end
                GROUP BY
                    profile.profession
                ORDER BY
                    amount DESC
                LIMIT 1
            `,
            {
                replacements: { 
                    start,
                    end
                 },
                type: Sequelize.QueryTypes.SELECT
            }
        )

        return bestProfession
    } catch (error) {
        console.log(error)
        throw error
    }
}

module.exports = {
    getBestProfession
}