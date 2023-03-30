const Sequelize = require('sequelize')
const CustomError = require('../utils/customError')

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
					end,
				},
				type: Sequelize.QueryTypes.SELECT,
			}
		)

		return bestProfession
	} catch (error) {
		throw error
	}
}

const getBestClients = async (sequelize, start, end, limit = 2) => {
	try {
		if (!start || !end) {
			throw new CustomError('Missing start or end date', 400)
		}

		const bestClients = await sequelize.query(
			`
                SELECT
                    profile.id,
                    profile.firstName || ' ' || profile.lastName AS fullName,
                    SUM(job.price) AS paid
                FROM
                    profiles AS profile
                LEFT JOIN
                    contracts AS contract ON contract.ClientId = profile.id
                LEFT JOIN
                    jobs AS job ON job.ContractId = contract.id
                WHERE
                    job.paid = true
                AND
                    job.paymentDate BETWEEN :start AND :end
                GROUP BY
                    profile.id
                ORDER BY
                    paid DESC
                LIMIT :limit
            `,
			{
				replacements: {
					start,
					end,
					limit,
				},
				type: Sequelize.QueryTypes.SELECT,
			}
		)

		return bestClients
	} catch (error) {
		throw error
	}
}

module.exports = {
	getBestProfession,
	getBestClients,
}
