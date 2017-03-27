import helper from '../helpers';

const app = helper.app;

describe('Routes: Index', () => {
  describe('GET /', () => {
    it('Should return http code 200 and a welcome message', (done) => {
      app.get('/')
        .expect(200)
        .end((err, res) => {
          res.status.should.equal(200);
          res.body.message.should
          .equal('Welcome to the document management api.');
          done();
        });
    });
  });
});
