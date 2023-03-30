const request = require('supertest')
const app = require('../app')

describe('Contracts Endpoint', () => {
    it('User not authenticated', async () => {
        const res = await request(app).get('/contracts')
        expect(res.statusCode).toEqual(401)
    })

    it('User authenticated', async () => {
        const res = await request(app)
            .get('/contracts')
            .set('profile_id', 1)
        expect(res.statusCode).toEqual(200)
    })

    it('Get contract by id', async () => {
        const res = await request(app)
            .get('/contracts/1')
            .set('profile_id', 1)
        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('id')
    })

    it('Get contracts by profile id', async () => {
        const res = await request(app)
            .get('/contracts')
            .set('profile_id', 1)
        expect(res.statusCode).toEqual(200)
        expect(res.body.length).toBeGreaterThan(0)
    })
    
})
