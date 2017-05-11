import { app, db, testData } from '../helpers.spec';

let adminToken, regularUserToken, privateDocument, personalDocument,
  publicDocument, documentsPaginationMeta, documentsList;

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
          privateDocument = response.body.document;
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
          personalDocument = response.body.document;
          response.status.should.equal(201);
          response.body.status.should.equal('success');
          response.body.document.access.should.equal('private');
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
          publicDocument = response.body.document;
          response.body.status.should.equal('success');
          response.body.document.access.should.equal('public');
          done();
        });
    });

    it('should create a document with an id', () => {
      privateDocument.should.have.property('id').equal(1);
      personalDocument.should.have.property('id').equal(2);
    });

    it('should create a document with a title', () => {
      privateDocument.should.have.property('title').equal('Cool title');
      publicDocument.should.have.property('title').equal('Cool title public');
    });
  });

  describe('Get Document: ', () => {
    it('should get a private document for an admin', (done) => {
      app.get(`/api/v1/documents/${privateDocument.id}`)
        .set({ 'x-access-token': adminToken })
        .end((error, response) => {
          response.status.should.equal(200);
          response.body.status.should.equal('success');
          response.body.document.should.have.property('id').equal(1);
          response.body.document.should.have.property('title').equal('Cool title');
          done();
        });
    });

    it('should get a public document for an admin', (done) => {
      app.get(`/api/v1/documents/${publicDocument.id}`)
        .set({ 'x-access-token': adminToken })
        .end((error, response) => {
          response.status.should.equal(200);
          response.body.status.should.equal('success');
          response.body.document.should.have.property('id').equal(3);
          response.body.document.should.have.property('title').equal('Cool title public');
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

    it('should not get document for a non logged in users', (done) => {
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
          res.body.message.should.equal('No document found');
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
          documentsPaginationMeta = response.body.paginationMeta;
          documentsList = response.body.documents;
          done();
        });
    });

    it('Should ensure documents list pagination meta is correct', () => {
      documentsPaginationMeta.should.have.property('pageSize').equal(10);
      documentsPaginationMeta.should.have.property('currentPage').equal(1);
      documentsPaginationMeta.should.have.property('pageCount').equal(1);
      documentsPaginationMeta.should.have.property('totalCount').equal(3);
    });

    it('Should ensure documents list is an object', () => {
      documentsList.should.be.an.instanceOf(Array);
    });

    it('Should ensure documents list returned is correct', () => {
      documentsList[0].should.have.property('id').equal(3);
      documentsList[0].should.have.property('title').equal('Cool title public');
    });

    it('should not get documents for a non logged in users', (done) => {
      app.get('/api/v1/documents')
        .end((err, res) => {
          res.status.should.equal(401);
          res.body.message.should.equal('Token required to access this route');
          done();
        });
    });

    it('should be able to limit the number of documents returned',
      (done) => {
        app.get('/api/v1/documents?limit=3')
          .set({ 'x-access-token': adminToken })
          .end((error, response) => {
            const documentLength = response.body.paginationMeta.outputCount;
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
            response.body.paginationMeta.should.have.property('currentPage').equal(1);
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
            response.body.message.should.equal('No document found');
            done();
          });
      });
  });

  describe('Regular user get accessible documents: ', () => {
    it('should get all public and document created by user in same role',
      (done) => {
        app.get('/api/v1/documents')
          .set({ 'x-access-token': regularUserToken })
          .end((error, response) => {
            response.status.should.equal(200);
            response.body.status.should.equal('success');
            response.body.documents[0].title.should.equal('Cool title public');
            response.body.paginationMeta.should.have.property('pageCount').equal(1);
            response.body.paginationMeta.outputCount.should.equal(2);
            done();
          });
      });

    it('should be able to limit the number of documents returned',
      (done) => {
        app.get('/api/v1/documents?limit=3')
          .set({ 'x-access-token': regularUserToken })
          .end((error, response) => {
            const documentLength = response.body.paginationMeta.outputCount;
            response.status.should.equal(200);
            response.body.status.should.equal('success');
            documentLength.should.belowOrEqual(3);
            done();
          });
      });

    it('should return not found for offset the database can\'t reach',
      (done) => {
        app.get('/api/v1/documents?offset=6&limit=10')
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
    it('should not get documents for a non logged in users', (done) => {
      app.get('/api/v1/users/1/documents')
        .end((err, res) => {
          res.status.should.equal(401);
          res.body.message.should.equal('Token required to access this route');
          done();
        });
    });

    it('should get all documents created by a user if logged in user is admin',
      (done) => {
        app.get('/api/v1/users/2/documents')
          .set({ 'x-access-token': adminToken })
          .end((error, response) => {
            response.status.should.equal(200);
            response.body.status.should.equal('success');
            documentsPaginationMeta = response.body.paginationMeta;
            documentsList = response.body.documents;
            done();
          });
      });

    it('Should ensure documents list pagination meta is correct', () => {
      documentsPaginationMeta.should.have.property('pageSize').equal(10);
      documentsPaginationMeta.should.have.property('currentPage').equal(1);
      documentsPaginationMeta.should.have.property('pageCount').equal(1);
      documentsPaginationMeta.should.have.property('totalCount').equal(1);
    });

    it('Should ensure documents list is an object', () => {
      documentsList.should.be.an.instanceOf(Array);
    });

    it('Should ensure documents list returned is correct', () => {
      documentsList[0].should.have.property('id').equal(2);
      documentsList[0].should.have.property('title').equal('Cool title private');
    });

    it('should be able to limit the number of documents returned',
      (done) => {
        app.get('/api/v1/users/1/documents?limit=3')
          .set({ 'x-access-token': adminToken })
          .end((error, response) => {
            const documentLength = response.body.paginationMeta.outputCount;
            response.status.should.equal(200);
            response.body.status.should.equal('success');
            documentLength.should.belowOrEqual(3);
            done();
          });
      });

    it('should return not found for offset the database can\'t reach',
      (done) => {
        app.get('/api/v1/users/1/documents?offset=6&limit=10')
          .set({ 'x-access-token': adminToken })
          .end((error, response) => {
            response.status.should.equal(404);
            response.body.status.should.equal('fail');
            response.body.message.should.equal('No document found');
            done();
          });
      });

    it('should get only public and role documents of another user if logged in user not admin',
      (done) => {
        app.get('/api/v1/users/1/documents')
          .set({ 'x-access-token': regularUserToken })
          .end((error, response) => {
            response.status.should.equal(200);
            response.body.status.should.equal('success');
            response.body.paginationMeta.should.have.property('currentPage').equal(1);
            response.body.documents[0].should.have.property('title').equal('Cool title public');
            done();
          });
      });

    it('should get all personal documents if logged in user',
      (done) => {
        app.get('/api/v1/users/1/documents')
          .set({ 'x-access-token': adminToken })
          .end((error, response) => {
            response.status.should.equal(200);
            response.body.status.should.equal('success');
            response.body.paginationMeta.should.have.property('currentPage').equal(1);
            response.body.documents[1].should.have.property('title').equal('Cool title');
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
            response.body.message.should.equal('Document not found');
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
            response.body.message.should.equal('Invalid token');
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

    it('Should not allow user update another users document',
      (done) => {
        app.patch(`/api/v1/documents/${privateDocument.id}`)
          .set({ 'x-access-token': regularUserToken })
          .send(testData.testDocApi)
          .end((error, response) => {
            response.status.should.equal(401);
            response.body.status.should.equal('fail');
            response.body.message.should
              .equal('You don\'t have authorization for this action');
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
            response.body.document.title.should.equal('Update Cool title');
            done();
          });
      });
  });

  describe('Delete document: ', () => {
    it('Should not allow a user to delete another user\'s document',
      (done) => {
        app.delete(`/api/v1/documents/${privateDocument.id}`)
          .set({ 'x-access-token': regularUserToken })
          .end((error, response) => {
            response.status.should.equal(401);
            response.body.status.should.equal('fail');
            response.body.message.should
              .equal('You don\'t have authorization for this action');
            done();
          });
      });

    it('Should not allow a user with an in-Valid token delete a user',
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

    it('Should allow a user with a valid token to delete personal document',
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
