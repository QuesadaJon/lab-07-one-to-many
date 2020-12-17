const fs = require('fs');
const request = require('supertest');
const pool = require('../lib/utils/pool');
const app = require('../lib/app');
const Phone = require('../lib/models/phones');
const Color = require('../lib/models/color');

describe('app test', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./data/setup.sql', 'utf-8'));
  });

  afterAll(() => {
    return pool.end();
  });

  it('creates new phone via POST', async() => {
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

  it('finds a phone by id and associated colors via GET', async() => {
    const phone = await Phone.insert({ 
      name: 'boogie', 
      brand: 'snot', 
      model: 't10045' 
    });

    const colors = await Promise.all([
      { color: 'blue', phoneId: phone.id },
      { color: 'green', phoneId: phone.id },
      { color: 'purple', phoneId: phone.id }
    ].map(color => Color.insert(color)));
    
    const response = await request(app)
      .get(`/api/v1/phones/${phone.id}`);
        
    expect(response.body).toEqual({
      ...phone,
      colors: expect.arrayContaining(colors)
    });
  });

  it('finds all phones via GET', async() => {
    const phone1 = await Phone.insert({ name:'booie', brand: 'snot', model:'t200s' });
    const phone2 = await Phone.insert({ name:'booie', brand: 'snot', model:'t200s' });
    const phone3 = await Phone.insert({ name:'booie', brand: 'snot', model:'t200s' });
  
    const response = await request(app)
      .get('/api/v1/phones');

    expect(response.body).toEqual([phone1, phone2, phone3]);
  });

  it('updates a phone via PUT', async() => {
    const phone = await Phone.insert({ name:'ooops', brand:'booorsh', model:'1234' });
  
    const response = await request(app)
      .put(`/api/v1/phones/${phone.id}`)
      .send({
        name: 'fixed',
        brand: 'icherio',
        model: 'better model'
      });

    expect(response.body).toEqual({
      id: '1',
      name: 'fixed',
      brand: 'icherio',
      model: 'better model'
    });
  });

  it('deletes a phone via DELETE', async() => {
    const phone = await Phone.insert({ name: '123', brand: '3333', model: 'kki23' });

    const response = await request(app)
      .delete(`/api/v1/phones/${phone.id}`);

    expect(response.text).toEqual(`phone with id of ${phone.id} has been deleted`);
  });
});
