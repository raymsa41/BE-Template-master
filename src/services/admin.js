const Sequelize = require('sequelize')
const CustomError = require('../utils/customError')
const { sequelize } = require('../model')

const getBestProfession = async (start, end) => {
	try {
        // check for missing parameters
		if (!start || !end) {
			throw new CustomError('Missing start or end date', 400)
		}

        // use a raw query because we have a 2 level nested query
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

const getBestClients = async (start, end, limit = 2) => {
	try {
        // check for missing parameters
		if (!start || !end) {
			throw new CustomError('Missing start or end date', 400)
		}

        // use a raw query because we have a 2 level nested query
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
