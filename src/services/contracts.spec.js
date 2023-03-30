const contractService = require('./contracts')
const seed = require('../../seeders/seed')

describe('Contract Service', () => {
    beforeAll(() => {
        return seed()
    })

    it('get by id', async () => {
        const contract = await contractService.getById(1)
        expect(contract).toHaveProperty('id')
    })

    it('get by id and profile id', async () => {
        const contract = await contractService.getById(1, 1)
        expect(contract).toHaveProperty('id')
    })

    it('get by id and profile id (not found)', async () => {
        const contract = await contractService.getById(1, 2)
        expect(contract).toBeNull()
    })

    it('get list by profile id', async () => {
        const contracts = await contractService.getListByProfileId(1)
        expect(contracts.length).toBeGreaterThan(0)
    })

})