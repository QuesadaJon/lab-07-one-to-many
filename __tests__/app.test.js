const fs = require('fs');
const request = require('supertest');
const pool = require('../lib/utils/pool');
const app = require('../lib/app');
// const Phones = require('../lib/models/phones');

describe('app test', () => {
    beforeEach(() => {
        return pool.query(fs.readFileSync('./data/setup.sql', 'utf-8'));
    });

    afterAll(() => {
        return pool.end();
    });

    it('creates new phone via POST', async () => {
        const response = await request(app)
            .post('/api/v1/phones')
            .send({
                name: 'fds',
                brand: 'ffs',
                model: 'fdd'
            });

        expect(response.body).toEqual({
            id: '1',
            name: 'fds',
            brand: 'ffs',
            model: 'fdd'
        });
    });
});
