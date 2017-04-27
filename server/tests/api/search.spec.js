import { app, db, testData } from '../helpers.spec';

let adminToken, regularUserToken;

describe('Search Api', () => {
  before((done) => {
    db.Role.create(testData.adminRole)
      .then(() => db.Role.create(testData.regularRole))
      .then(() => {
        testData.adminUser.roleId = 1;
        return db.User.create(testData.adminUser);
      })
      .then(() => db.User.create(testData.testUser))
      .then(() => db.Document.create(testData.testDoc))
      .then(() => {
        testData.testDoc.creatorId = 2;
        testData.testDoc.title = 'Title by regular user';
        db.Document.create(testData.testDoc);
      })
      .then(() => app.post('/api/v1/users/login').send({
        username: testData.adminUser.username,
        password: testData.adminUser.password
      }))
      .then((res) => {
        adminToken = res.body.token;
      })
      .then(() => app.post('/api/v1/users/login').send({
        username: testData.testUser.username,
        password: testData.testUser.password
      }))
      .then((res) => {
        regularUserToken = res.body.token;
      })
      .then(() => {
        done();
      });
  });

  after(() => db.sequelize.sync({ force: true }));

  describe('Search documents: ', () => {
    it('should allow admin search for every documents with document title', (done) => {
      app.get('/api/v1/search/documents/?q=cool')
        .set({ 'x-access-token': adminToken })
        .end((error, response) => {
          response.status.should.equal(200);
          response.body.status.should.equal('success');
          response.body.data.documents[0].title.should.equal('Cool title');
          response.body.data.paginationMeta.should.have.property('pageSize');
          done();
        });
    });

    it('should user search for peronal documents with document title', (done) => {
      app.get('/api/v1/users/documents/?q=by regular user')
        .set({ 'x-access-token': regularUserToken })
        .end((error, response) => {
          response.status.should.equal(200);
          response.body.status.should.equal('success');
          response.body.data.documents[0].title.should.equal('Title by regular user');
          response.body.data.paginationMeta.should.have.property('pageSize');
          done();
        });
    });

    it('should be able to limit the number of documents returned',
      (done) => {
        app.get('/api/v1/search/documents/?q=cool&limit=3')
          .set({ 'x-access-token': adminToken })
          .end((error, response) => {
            const documentLength = response.body.data.paginationMeta.outputCount;
            response.status.should.equal(200);
            response.body.status.should.equal('success');
            documentLength.should.belowOrEqual(3);
            done();
          });
      });

    it('should be able to get current page base on offset set for documents returned',
      (done) => {
        app.get('/api/v1/search/documents/?q=cool&offset=0')
          .set({ 'x-access-token': adminToken })
          .end((error, response) => {
            response.status.should.equal(200);
            response.body.status.should.equal('success');
            response.body.data.paginationMeta.should.have.property('currentPage');
            response.body.data.paginationMeta.currentPage.should.equal(1);
            done();
          });
      });

    it('should return not found for offset the database can\'t reach',
      (done) => {
        app.get('/api/v1/search/documents/?q=cool&offset=6')
          .set({ 'x-access-token': adminToken })
          .end((error, response) => {
            response.status.should.equal(404);
            response.body.status.should.equal('fail');
            response.body.message.should.equal('No document found');
            done();
          });
      });
  });

  describe('Search users: ', () => {
    it('should allow admin search for users with username', (done) => {
      app.get('/api/v1/search/users/?q=Andela_1')
        .set({ 'x-access-token': adminToken })
        .end((error, response) => {
          response.status.should.equal(200);
          response.body.status.should.equal('success');
          response.body.data.users[0].username.should.equal('Andela_1');
          response.body.data.paginationMeta.should.have.property('pageSize');
          done();
        });
    });

    it('should allow admin search for users with firstname', (done) => {
      app.get('/api/v1/search/users/?q=Ayo')
        .set({ 'x-access-token': adminToken })
        .end((error, response) => {
          response.status.should.equal(200);
          response.body.status.should.equal('success');
          response.body.data.users[0].firstname.should.equal('Ayobami');
          response.body.data.paginationMeta.should.have.property('pageSize');
          done();
        });
    });

    it('should allow admin search for users with lastname', (done) => {
      app.get('/api/v1/search/users/?q=Shaibu')
        .set({ 'x-access-token': adminToken })
        .end((error, response) => {
          response.status.should.equal(200);
          response.body.status.should.equal('success');
          response.body.data.users[0].lastname.should.equal('Shaibu');
          response.body.data.paginationMeta.should.have.property('pageSize');
          done();
        });
    });


    it('should be able to limit the number of users returned',
      (done) => {
        app.get('/api/v1/search/users/?q=Ande&limit=3')
          .set({ 'x-access-token': adminToken })
          .end((error, response) => {
            const userLength = response.body.data.paginationMeta.outputCount;
            response.status.should.equal(200);
            response.body.status.should.equal('success');
            userLength.should.belowOrEqual(3);
            done();
          });
      });

    it('should be able to get current page base on offset set for users returned',
      (done) => {
        app.get('/api/v1/search/users/?q=Ande&offset=1')
          .set({ 'x-access-token': adminToken })
          .end((error, response) => {
            response.status.should.equal(200);
            response.body.status.should.equal('success');
            response.body.data.paginationMeta.should.have.property('currentPage');
            response.body.data.paginationMeta.currentPage.should.equal(1);
            done();
          });
      });

    it('should return not found for offset the database can\'t reach',
      (done) => {
        app.get('/api/v1/search/users/?q=Ande&offset=6')
          .set({ 'x-access-token': adminToken })
          .end((error, response) => {
            response.status.should.equal(404);
            response.body.status.should.equal('fail');
            response.body.message.should.equal('No User found');
            done();
          });
      });
  });
});
