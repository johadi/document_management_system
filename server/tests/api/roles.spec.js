import { app, db, testData } from '../helpers.spec';

let adminToken, regularUserToken, roleCreated;

describe('Users Api:', () => {
  before((done) => {
    db.Role.create({ title: 'admin' })
      .then(() => db.Role.create({ title: 'regular' }))
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
    it('should create a new role', (done) => {
      app.post('/api/v1/roles')
        .send({ title: 'editor' })
        .set({ 'x-access-token': adminToken })
        .end((error, response) => {
          roleCreated = response.body.role;
          response.status.should.equal(201);
          response.body.status.should.equal('success');
          done();
        });
    });

    it('should not create role if an invalid creation data is supplied',
      (done) => {
        app.post('/api/v1/documents')
          .send({ title24: 'editor' })
          .set({ 'x-access-token': adminToken })
          .then((response) => {
            response.status.should.equal(400);
            response.body.status.should.equal('fail');
            response.body.message.should
              .equal('Badly formatted request body including ( title24 )');
            done();
          });
      });

    it('should send an error message for a user not logged in', (done) => {
      app.post('/api/v1/documents')
        .send({ title: 'publisher' })
        .end((error, response) => {
          response.status.should.equal(401);
          response.body.status.should.equal('fail');
          response.body.message.should
            .equal('Token required to access this route');
          done();
        });
    });

    it('should create a role with a title', () => {
      roleCreated.should.have.property('title').equal('editor');
    });
  });

  describe('Get Role: ', () => {
    it('should get a role', (done) => {
      app.get(`/api/v1/roles/${roleCreated.id}`)
        .set({ 'x-access-token': adminToken })
        .end((error, response) => {
          response.status.should.equal(200);
          response.body.status.should.equal('success');
          response.body.role.should.have.property('title').equal('editor');
          done();
        });
    });

    it('should not return a role to a regular user', (done) => {
      app.get(`/api/v1/roles/${roleCreated.id}`)
        .set({ 'x-access-token': regularUserToken })
        .end((err, res) => {
          res.status.should.equal(403);
          res.body.message.should
            .equal('User is unauthorized for this request.');
          done();
        });
    });

    it('should return not found for a role not existing', (done) => {
      app.get('/api/v1/roles/1220000')
        .set({ 'x-access-token': adminToken })
        .end((err, res) => {
          res.status.should.equal(404);
          res.body.message.should.equal('Role not found');
          done();
        });
    });
  });

  describe('Admin get roles: ', () => {
    it('should get all roles for an admin', (done) => {
      app.get('/api/v1/roles')
        .set({ 'x-access-token': adminToken })
        .end((error, response) => {
          response.status.should.equal(200);
          response.body.status.should.equal('success');
          done();
        });
    });

    it('should not get documents for a non logged in users', (done) => {
      app.get('/api/v1/roles')
        .end((err, res) => {
          res.status.should.equal(401);
          res.body.message.should.equal('Token required to access this route');
          done();
        });
    });
  });

  describe('Update role: ', () => {
    it('Should not allow role update if an invalid id is supplied',
      (done) => {
        app.patch('/api/v1/roles/fffa')
          .set({ 'x-access-token': adminToken })
          .send({ title: 'writer' })
          .end((error, response) => {
            response.status.should.equal(406);
            response.body.status.should.equal('fail');
            response.body.message.should
              .equal('Parameter supplied should be a number');
            done();
          });
      });

    it('Should not allow role update if the role does not exist',
      (done) => {
        app.patch('/api/v1/roles/1000')
          .set({ 'x-access-token': adminToken })
          .send({ title: 'senior writer' })
          .end((error, response) => {
            response.status.should.equal(404);
            response.body.status.should.equal('fail');
            response.body.message.should.equal('Role not found');
            done();
          });
      });

    it('Should not allow role update if an invalid token is supplied',
      (done) => {
        app.patch(`/api/v1/roles/${roleCreated.id}`)
          .set({ 'x-access-token': 'regularUserToken' })
          .send({ title: 'senior writer' })
          .end((error, response) => {
            response.status.should.equal(401);
            response.body.status.should.equal('fail');
            response.body.message.should.equal('Invalid token');
            done();
          });
      });

    it('Should not allow role update if no token is supplied',
      (done) => {
        app.patch(`/api/v1/roles/${roleCreated.id}`)
          .send(testData.testDocApi)
          .end((error, response) => {
            response.status.should.equal(401);
            response.body.status.should.equal('fail');
            response.body.message.should
              .equal('Token required to access this route');
            done();
          });
      });
  });

  describe('Delete role: ', () => {
    it('Should not allow a user with an in-Valid token delete a user',
      (done) => {
        app.delete(`/api/v1/roles/${roleCreated.id}`)
          .set({ 'x-access-token': 'invalidToken' })
          .end((error, response) => {
            response.status.should.equal(401);
            response.body.status.should.equal('fail');
            response.body.message.should.equal('Invalid token');
            done();
          });
      });

    it('Should allow an admin with a valid token to delete role',
      (done) => {
        app.delete(`/api/v1/roles/${roleCreated.id}`)
          .set({ 'x-access-token': adminToken })
          .end((error, response) => {
            response.status.should.equal(200);
            response.body.status.should.equal('success');
            done();
          });
      });

    it('Should return role does not found if trying to \
delete a non existing role', (done) => {
      app.delete(`/api/v1/roles/${roleCreated.id}`)
        .set({ 'x-access-token': adminToken })
        .end((error, response) => {
          response.status.should.equal(404);
          response.body.status.should.equal('fail');
          response.body.message.should
            .equal('Role not found');
          done();
        });
    });
  });
});
