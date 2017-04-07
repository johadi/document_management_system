import { app } from '../helpers.spec';

describe('Routes: Index', () => {
  describe('GET /api/v1', () => {
    it('Should return http code 200', (done) => {
      app.get('/api/v1/')
        .expect(200, done);
    });

    it('Should return welcome message', (done) => {
      app.get('/api/v1/')
        .end((err, res) => {
          res.body.message.should
            .equal('Welcome to the document management api.');
          done();
        });
    });

    it('Should return json format', (done) => {
      app.get('/api/v1/')
        .expect('Content-Type', /json/, done);
    });
  });
});
