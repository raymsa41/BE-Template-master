const express = require('express');
const bodyParser = require('body-parser');
const {sequelize, Profile, Contract} = require('./model')
const {getProfile} = require('./middleware/getProfile')
const contracts = require('./routes/contracts')

const Sequelize = require('sequelize');

const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize)
app.set('models', sequelize.models)

app.use('/contracts', getProfile, contracts)

/* Error handler middleware */
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const errorMessage = statusCode !== 500 ? err.message : 'Internal server error'

    console.error(errorMessage, err.stack)

    res.status(statusCode).json({
        'message': errorMessage
    }).end()

    return
})

/**
 * FIX ME!
 * @returns contract by id
 */
app.get('/contracts/:id',getProfile ,async (req, res) =>{
    const {Contract} = req.app.get('models')
    const {id} = req.params
    const contract = await Contract.findOne({where: {id}})
    if(!contract) return res.status(404).end()
    res.json(contract)
})

// use increment or decrement to update the balance


const foo = async () => {
    const profile = await Profile.findOne({
        where: {id: 1},
        // include: Contract
        // include: [Contract]
        include: ['Contractor', 'Client']
    })

    console.log(profile.toJSON())

    const contracts = await Contract.findAll({
        where: {
            [Sequelize.Op.and]: [
                {
                    [Sequelize.Op.or]: [
                        {
                            ClientId: 1
                        },
                        {
                            ContractorId: 1
                        }
                    ]
                },
                {
                    status: {
                        [Sequelize.Op.not]: 'terminated'
                    }
                }
            ],
            
        },
        include: []
    })
    
    console.log(contracts.map(c => c.toJSON()))
}
// foo()


module.exports = app;
