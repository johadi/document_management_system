import { app, db, testData } from '../helpers.spec';

let adminToken, regularUserToken, privateDocument, personalDocument, publicDocument;

describe('Document Api', () => {
  before((done) => {
    db.Role.create(testData.adminRole)
      .then(() => db.Role.create(testData.regularRole))
      .then(() => {
        testData.adminUser.roleId = 1;
        return db.User.create(testData.adminUser);
      })
      .then(() => db.User.create(testData.testUser))
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

  describe('Create: ', () => {
    it('should create a new document', (done) => {
      app.post('/api/v1/documents')
        .send(testData.testDocApi)
        .set({ 'x-access-token': adminToken })
        .end((error, response) => {
          privateDocument = response.body.data;
          response.status.should.equal(201);
          response.body.status.should.equal('success');
          done();
        });
    });

    it('should not create document if an invalid creation data is supplied',
      (done) => {
        testData.testDocApi.mode = 'ff';
        app.post('/api/v1/documents')
          .send(testData.testDocApi)
          .set({ 'x-access-token': regularUserToken })
          .then((response) => {
            response.status.should.equal(400);
            response.body.status.should.equal('fail');
            response.body.message.should
              .equal('Badly formatted request body including ( mode )');
            done();
          });
      });

    it('should send an error message for a user not logged in', (done) => {
      app.post('/api/v1/documents')
        .send(testData.testDocApi)
        .end((error, response) => {
          response.status.should.equal(401);
          response.body.status.should.equal('fail');
          response.body.message.should
            .equal('Token required to access this route');
          done();
        });
    });

    it('should be able create a private document', (done) => {
      delete testData.testDocApi.mode;
      testData.testDocApi.title = 'Cool title private';
      app.post('/api/v1/documents')
        .send(testData.testDocApi)
        .set({ 'x-access-token': regularUserToken })
        .end((error, response) => {
          personalDocument = response.body.data;
          response.body.status.should.equal('success');
          response.body.data.access.should.equal('private');
          done();
        });
    });

    it('should be able create a public document', (done) => {
      testData.testDocApi.access = 'public';
      testData.testDocApi.title = 'Cool title public';
      app.post('/api/v1/documents')
        .send(testData.testDocApi)
        .set({ 'x-access-token': adminToken })
        .end((error, response) => {
          publicDocument = response.body.data;
          response.body.status.should.equal('success');
          response.body.data.access.should.equal('public');
          done();
        });
    });

    it('should create a document with an id', () => {
      privateDocument.should.have.property('id');
      publicDocument.should.have.property('id');
    });
  });

  describe('Get Document: ', () => {
    it('should get a private document for an admin', (done) => {
      app.get(`/api/v1/documents/${privateDocument.id}`)
        .set({ 'x-access-token': adminToken })
        .end((error, response) => {
          response.status.should.equal(200);
          response.body.status.should.equal('success');
          response.body.data.should.have.property('id');
          response.body.data.should.have.property('title');
          done();
        });
    });

    it('should get a public document for an admin', (done) => {
      app.get(`/api/v1/documents/${publicDocument.id}`)
        .set({ 'x-access-token': adminToken })
        .end((error, response) => {
          response.status.should.equal(200);
          response.body.status.should.equal('success');
          response.body.data.should.have.property('id');
          response.body.data.should.have.property('title');
          done();
        });
    });

    it(`should not return a private document to a regular user
    who does not own the document`, (done) => {
      app.get(`/api/v1/documents/${privateDocument.id}`)
        .set({ 'x-access-token': regularUserToken })
        .end((err, res) => {
          res.status.should.equal(401);
          res.body.message.should
            .equal('User is unauthorized for this request');
          done();
        });
    });

    it('should not get documents for a non logged in users', (done) => {
      app.get(`/api/v1/documents/${privateDocument.id}`)
        .end((err, res) => {
          res.status.should.equal(401);
          res.body.message.should.equal('Token required to access this route');
          done();
        });
    });

    it('should return not found for a document not existing', (done) => {
      app.get('/api/v1/documents/1220000')
        .set({ 'x-access-token': adminToken })
        .end((err, res) => {
          res.status.should.equal(404);
          res.body.message.should.equal('Document not found');
          done();
        });
    });
  });

  describe('Admin get documents: ', () => {
    it('should get all documents for an admin', (done) => {
      app.get('/api/v1/documents/')
        .set({ 'x-access-token': adminToken })
        .end((error, response) => {
          response.status.should.equal(200);
          response.body.status.should.equal('success');
          response.body.data.paginationMeta.should.have.property('pageCount');
          response.body.data.paginationMeta.should.have.property('pageSize');
          done();
        });
    });

    it('should not allow a regular user to get all documents', (done) => {
      app.get('/api/v1/documents/')
        .set({ 'x-access-token': regularUserToken })
        .end((error, response) => {
          response.status.should.equal(403);
          response.body.status.should.equal('fail');
          response.body.message.should
            .equal('User is unauthorized for this request.');
          done();
        });
    });

    it('should be able to limit the number of documents returned',
      (done) => {
        app.get('/api/v1/documents?limit=3')
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
        app.get('/api/v1/documents?offset=1')
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
        app.get('/api/v1/documents?offset=6&limit=10')
          .set({ 'x-access-token': adminToken })
          .end((error, response) => {
            response.status.should.equal(404);
            response.body.status.should.equal('fail');
            response.body.message.should.equal('No Document found');
            done();
          });
      });
  });

  describe('Regular user accessible documents: ', () => {
    it('should get all public and document created by user in same role',
      (done) => {
        app.get('/api/v1/documents/accessible')
          .set({ 'x-access-token': regularUserToken })
          .end((error, response) => {
            response.status.should.equal(200);
            response.body.status.should.equal('success');
            response.body.data.documents[0].title.should.equal('Cool title public');
            response.body.data.paginationMeta.should.have.property('pageCount');
            response.body.data.paginationMeta.outputCount.should.equal(1);
            done();
          });
      });

    it('should be able to limit the number of documents returned',
      (done) => {
        app.get('/api/v1/documents/accessible?limit=3')
          .set({ 'x-access-token': regularUserToken })
          .end((error, response) => {
            const documentLength = response.body.data.paginationMeta.outputCount;
            response.status.should.equal(200);
            response.body.status.should.equal('success');
            documentLength.should.belowOrEqual(3);
            done();
          });
      });

    it('should return not found for offset the database can\'t reach',
      (done) => {
        app.get('/api/v1/documents/accessible?offset=6&limit=10')
          .set({ 'x-access-token': regularUserToken })
          .end((error, response) => {
            response.status.should.equal(404);
            response.body.status.should.equal('fail');
            response.body.message.should.equal('No document found');
            done();
          });
      });
  });

  describe('Get user created documents: ', () => {
    it('should get all document created by user',
      (done) => {
        app.get('/api/v1/users/documents')
          .set({ 'x-access-token': adminToken })
          .end((error, response) => {
            response.status.should.equal(200);
            response.body.status.should.equal('success');
            response.body.data.documents[0].title.should.equal('Cool title');
            response.body.data.paginationMeta.should.have.property('pageCount');
            response.body.data.paginationMeta.outputCount.should.equal(2);
            done();
          });
      });

    it('should be able to limit the number of documents returned',
      (done) => {
        app.get('/api/v1/users/documents?limit=3')
          .set({ 'x-access-token': adminToken })
          .end((error, response) => {
            const documentLength = response.body.data.paginationMeta.outputCount;
            response.status.should.equal(200);
            response.body.status.should.equal('success');
            documentLength.should.belowOrEqual(3);
            done();
          });
      });

    it('should return not found for offset the database can\'t reach',
      (done) => {
        app.get('/api/v1/users/documents?offset=6&limit=10')
          .set({ 'x-access-token': adminToken })
          .end((error, response) => {
            response.status.should.equal(404);
            response.body.status.should.equal('fail');
            response.body.message.should.equal('No document found');
            done();
          });
      });
  });

  describe('Update document: ', () => {
    it('Should not allow document update if an invalid id is supplied',
      (done) => {
        app.patch('/api/v1/documents/fffa')
          .set({ 'x-access-token': adminToken })
          .send(testData.testDocApi)
          .end((error, response) => {
            response.status.should.equal(406);
            response.body.status.should.equal('fail');
            response.body.message.should
              .equal('Parameter supplied should be a number');
            done();
          });
      });

    it('Should not allow document update if the document does not exist',
      (done) => {
        testData.testDocApi.title = 'Update Cool title';
        app.patch('/api/v1/documents/1000')
          .set({ 'x-access-token': adminToken })
          .send(testData.testDocApi)
          .end((error, response) => {
            response.status.should.equal(404);
            response.body.status.should.equal('fail');
            response.body.message.should
              .equal('Document not found');
            done();
          });
      });

    it('Should not allow document update if an invalid token is supplied',
      (done) => {
        app.patch(`/api/v1/documents/${personalDocument.id}`)
          .set({ 'x-access-token': 'regularUserToken' })
          .send(testData.testDocApi)
          .end((error, response) => {
            response.status.should.equal(401);
            response.body.status.should.equal('fail');
            response.body.message.should
              .equal('Invalid token');
            done();
          });
      });

    it('Should not allow document update if no token is supplied',
      (done) => {
        app.patch(`/api/v1/documents/${personalDocument.id}`)
          .send(testData.testDocApi)
          .end((error, response) => {
            response.status.should.equal(401);
            response.body.status.should.equal('fail');
            response.body.message.should
              .equal('Token required to access this route');
            done();
          });
      });

    it('Should not allow regular user update another users document',
      (done) => {
        app.patch(`/api/v1/documents/${privateDocument.id}`)
          .set({ 'x-access-token': regularUserToken })
          .send(testData.testDocApi)
          .end((error, response) => {
            response.status.should.equal(401);
            response.body.status.should.equal('fail');
            response.body.message.should
              .equal('User is unauthorized for this request');
            done();
          });
      });

    it(`Should not allow user to update document if invalid update
fields are supplied`,
      (done) => {
        testData.testDocApi.invalidField = 'hello';
        app.patch(`/api/v1/documents/${personalDocument.id}`)
          .set({ 'x-access-token': regularUserToken })
          .send(testData.testDocApi)
          .end((error, response) => {
            response.status.should.equal(400);
            response.body.status.should.equal('fail');
            response.body.message.should
              .equal('Badly formatted request body including ( invalidField )');
            done();
          });
      });

    it('Should allow a User Update profile if he has a valid Token',
      (done) => {
        delete testData.testDocApi.invalidField;
        app.patch(`/api/v1/documents/${personalDocument.id}`)
          .set({ 'x-access-token': regularUserToken })
          .send(testData.testDocApi)
          .end((error, response) => {
            response.status.should.equal(200);
            response.body.data.title.should.equal('Update Cool title');
            done();
          });
      });
  });

  describe('Delete document: ', () => {
    it('Should not allow a non-admin user to delete another user\'s document',
      (done) => {
        app.delete(`/api/v1/documents/${privateDocument.id}`)
          .set({ 'x-access-token': regularUserToken })
          .end((error, response) => {
            response.status.should.equal(401);
            response.body.status.should.equal('fail');
            response.body.message.should
              .equal('User is unauthorized for this request');
            done();
          });
      });

    it('Should not allow an user with an in-Valid token delete a user',
      (done) => {
        app.delete(`/api/v1/documents/${privateDocument.id}`)
          .set({ 'x-access-token': 'invalidToken' })
          .end((error, response) => {
            response.status.should.equal(401);
            response.body.status.should.equal('fail');
            response.body.message.should.equal('Invalid token');
            done();
          });
      });

    it('Should allow an admin user with a valid token to delete any user',
      (done) => {
        app.delete(`/api/v1/documents/${privateDocument.id}`)
          .set({ 'x-access-token': adminToken })
          .end((error, response) => {
            response.status.should.equal(200);
            response.body.status.should.equal('success');
            response.body.message.should
              .equal('Document deleted successfully');
            done();
          });
      });

    it('Should return document does not found if trying to \
delete a non existing document', (done) => {
      app.delete(`/api/v1/documents/${privateDocument.id}`)
        .set({ 'x-access-token': adminToken })
        .end((error, response) => {
          response.status.should.equal(404);
          response.body.status.should.equal('fail');
          response.body.message.should
            .equal('Document not found');
          done();
        });
    });
  });
});
