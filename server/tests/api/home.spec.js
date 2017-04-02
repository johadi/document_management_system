import helper from '../helpers';

const app = helper.app;

describe('Routes: Index', () => {
  describe('GET /', () => {
    it('Should return http code 200', (done) => {
      app.get('/')
        .expect(200, done);
    });

    it('Should return welcome message', (done) => {
      app.get('/')
        .end((err, res) => {
          res.body.message.should
            .equal('Welcome to the document management api.');
          done();
        });
    });

    it('Should return json format', (done) => {
      app.get('/')
        .expect('Content-Type', /json/, done);
    });
  });
});
