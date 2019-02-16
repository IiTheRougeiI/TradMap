const request = require('supertest');

const app = require('../src/app');

describe('GET /api/v1', () => {
  it('responds with a json message', function(done) {
    request(app)
      .get('/api/v1')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, {
        message: 'Failte'
      }, done);
  });
});

describe('POST /api/v1/Sessions', () => {
  it('Inserts a new sesssion', function(done) {
    const requestSesh = {
      name: 'Big one',
      address: 'Its a big one',
      latitude: -90,
      longitude: 180

    };

    const responseSesh = {
      ...requestSesh,
      _id: '5c61',
      date: '2013-03-06 21:02:44'
    };

    request(app)
      .post('/api/v1/Sessions')
      .send(requestSesh)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(res => {
        res.body._id= '5c61';
        res.body.date='2013-03-06 21:02:44';
      })
      .expect(200, responseSesh, done);
  });
});
