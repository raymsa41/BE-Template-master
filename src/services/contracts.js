const Sequelize = require('sequelize')
const { Contract, Profile } = require('../model')

const contractPublicAttributes = [
	'id',
	'terms',
	'status',
	'createdAt',
	'updatedAt',
]

const includeContractor = {
	model: Profile,
	as: 'Contractor',
	attributes: [
		'id',
		'firstName',
		'lastName',
		'profession',
		'createdAt',
		'updatedAt',
	],
}

const includeClient = {
	model: Profile,
	as: 'Client',
	attributes: [
		'id',
		'firstName',
		'lastName',
		'profession',
		'createdAt',
		'updatedAt',
	],
}

const getListByProfileId = async (profileId) => {
	try {
        // only send to the API client relevant fields
		const contracts = await Contract.findAll({
			where: {
				[Sequelize.Op.and]: [
					{
						[Sequelize.Op.or]: [
							{
								ClientId: profileId,
							},
							{
								ContractorId: profileId,
							},
						],
					},
					{
						status: {
							[Sequelize.Op.not]: 'terminated',
						},
					},
				],
			},
			include: [includeContractor, includeClient],
			attributes: [...contractPublicAttributes],
		})

		return contracts
	} catch (error) {}
}

const getById = async (id, profileId = null) => {
	try {
        // conditionaly filter for profileId if we have one
		const filter = [
			{
				id: id,
			},
		]
		if (profileId) {
			filter.push({
				[Sequelize.Op.or]: [
					{
						ClientId: profileId,
					},
					{
						ContractorId: profileId,
					},
				],
			})
		}
        // only send to the API client relevant fields
		const contract = await Contract.findOne({
			where: {
				[Sequelize.Op.and]: filter,
			},
			include: [includeContractor, includeClient],
			attributes: [...contractPublicAttributes],
		})

		return contract
	} catch (error) {}
}

module.exports = {
	contractPublicAttributes,
	getListByProfileId,
	getById,
}
