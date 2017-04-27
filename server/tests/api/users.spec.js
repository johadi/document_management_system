import { app, db, testData } from '../helpers.spec';

let regularUser, adminToken, regularUserToken;

describe('Users Api:', () => {
  before((done) => {
    db.Role.create(testData.adminRole)
      .then(() => db.Role.create(testData.regularRole))
      .then(() => {
        testData.adminUser.roleId = 1;
        return db.User.create(testData.adminUser);
      })
      .then(() => {
        done();
      });
  });

  after(() => db.sequelize.sync({ force: true }));

  describe('Create Regular User', () => {
    it('Should return http code 201 if a Regular User is created', (done) => {
      testData.testUser.password_confirmation = 'password';
      app.post('/api/v1/users')
        .send(testData.testUser)
        .end((error, response) => {
          regularUser = response.body.data;
          response.status.should.equal(201);
          done();
        });
    });

    it('Should ensure that a new user has a roleId', () => {
      regularUser.should.have.property('roleId').equal(2);
    });

    it('Should ensure that a new user has a firstname', () => {
      regularUser.should.have.property('firstname');
    });

    it('Should ensure that a new user has a lastname', () => {
      regularUser.should.have.property('lastname');
    });

    it('Should ensure that a new user has a username', () => {
      regularUser.should.have.property('username');
    });

    it('Should not allow duplicate username in the database', (done) => {
      testData.testUser.email = 'email@gmail.com';
      app.post('/api/v1/users')
        .send(testData.testUser)
        .end((error, response) => {
          response.status.should.equal(409);
          response.body.status.should.equal('fail');
          response.body.message.should
            .equal('This username Andela is already in use');
          done();
        });
    });

    it('Should not allow duplicate email in the database', (done) => {
      testData.testUser.username = 'roseline';
      testData.testUser.email = 'ayo@gmail.com';
      app.post('/api/v1/users')
        .send(testData.testUser)
        .end((error, response) => {
          response.status.should.equal(409);
          response.body.status.should.equal('fail');
          response.body.message.should
            .equal('This email ayo@gmail.com is already in use');
          done();
        });
    });

    it(`Should disallow user creation if the password does not match
password confirmation`,
      (done) => {
        testData.testUser.password_confirmation = 'adada';
        app.post('/api/v1/users')
          .send(testData.testUser)
          .end((error, response) => {
            response.status.should.equal(400);
            response.body.status.should.equal('error');
            response.body.errors[0].should
              .equal('The password confirmation does not match.');
            done();
          });
      });

    it('Should disallow user creation if request body contains invalid keys',
      (done) => {
        testData.testUser.phone = 'hello';
        app.post('/api/v1/users')
          .send(testData.testUser)
          .end((error, response) => {
            const badKeys = '( phone )';
            response.status.should.equal(400);
            response.body.status.should.equal('fail');
            response.body.message.should
              .equal(`Badly formatted request body including ${badKeys}`);
            done();
          });
      });

    it('Should require a password of at least 6 characters', (done) => {
      delete testData.testUser.phone;
      testData.testUser.password = 'abc';
      testData.testUser.password_confirmation = 'abc';
      delete testData.testUser.use;
      app.post('/api/v1/users')
        .send(testData.testUser)
        .end((error, response) => {
          response.status.should.equal(400);
          response.body.status.should.equal('error');
          response.body.errors[0].should
            .equal('The password must be at least 6 characters.');
          done();
        });
    });

    it('Should not allow roleId in request body during creation if not admin',
      (done) => {
        testData.testUser.roleId = '2';
        app.post('/api/v1/users')
          .send(testData.testUser)
          .end((error, response) => {
            response.status.should.equal(400);
            response.body.status.should.equal('fail');
            response.body.message.should
              .equal('Badly formatted request body including ( roleId )');
            done();
          });
      });

    it('Should only allow usernames having more than 5 characters', (done) => {
      testData.testUser.username = 'ad';
      testData.testUser.password = 'fakeuser';
      testData.testUser.password_confirmation = 'fakeuser';
      delete testData.testUser.roleId;
      app.post('/api/v1/users')
        .send(testData.testUser)
        .end((error, response) => {
          response.status.should.equal(400);
          response.body.status.should.equal('error');
          response.body.errors[0].should
            .equal('The username field must be between 6 and 40.');
          done();
        });
    });

    it('Should only allow usernames having less than 40 characters', (done) => {
      testData.testUser.username = testData.longTitle;
      app.post('/api/v1/users')
        .send(testData.testUser)
        .end((error, response) => {
          response.status.should.equal(400);
          response.body.status.should.equal('error');
          response.body.errors[0].should
            .equal('The username field must be between 6 and 40.');
          done();
        });
    });

    it('Should only allow firstnames having more than 1 characters', (done) => {
      testData.testUser.username = 'nonso1234';
      testData.testUser.firstname = 'e';
      testData.testUser.email = 'nonso@gmail.com';
      app.post('/api/v1/users')
        .send(testData.testUser)
        .end((error, response) => {
          response.status.should.equal(400);
          response.body.status.should.equal('error');
          response.body.errors[0].should
            .equal('The firstname field must be between 2 and 40.');
          done();
        });
    });

    it('Should only allow firstnames having less than 40 characters',
      (done) => {
        testData.testUser.firstname = testData.longTitle;
        app.post('/api/v1/users')
          .send(testData.testUser)
          .end((error, response) => {
            response.status.should.equal(400);
            response.body.status.should.equal('error');
            response.body.errors[0].should
              .equal('The firstname field must be between 2 and 40.');
            done();
          });
      });

    it('Should only allow lastnames having more than 2 characters', (done) => {
      testData.testUser.firstname = 'tope';
      testData.testUser.lastname = 'e';
      app.post('/api/v1/users')
        .send(testData.testUser)
        .end((error, response) => {
          response.status.should.equal(400);
          response.body.status.should.equal('error');
          response.body.errors[0].should
            .equal('The lastname field must be between 2 and 40.');
          done();
        });
    });

    it('Should only allow lastnames having less than 40 characters',
      (done) => {
        testData.testUser.lastname = testData.longTitle;
        app.post('/api/v1/users')
          .send(testData.testUser)
          .end((error, response) => {
            response.status.should.equal(400);
            response.body.status.should.equal('error');
            response.body.errors[0].should
              .equal('The lastname field must be between 2 and 40.');
            done();
          });
      });

    it('Should only allow valid emails',
      (done) => {
        testData.testUser.firstname = 'emma';
        testData.testUser.lastname = 'shaibu';
        testData.testUser.email = 'tope';
        app.post('/api/v1/users')
          .send(testData.testUser)
          .end((error, response) => {
            response.status.should.equal(400);
            response.body.status.should.equal('error');
            response.body.errors[0].should
              .equal('The email format is invalid.');
            done();
          });
      });

    it('Should only allow emails less than 254 characters',
      (done) => {
        testData.testUser.email = testData.longEmail;
        app.post('/api/v1/users')
          .send(testData.testUser)
          .end((error, response) => {
            response.status.should.equal(400);
            response.body.errors[0].message.should
              .equal('The email you entered is invalid.');
            done();
          });
      });

    it('Should disallow user creation if password confirmation is empty',
      (done) => {
        testData.testUser.email = 'tope@gmail.com';
        testData.testUser.password_confirmation = '';
        app.post('/api/v1/users')
          .send(testData.testUser)
          .end((error, response) => {
            response.status.should.equal(400);
            response.body.status.should.equal('error');
            response.body.errors[1].should
              .equal('The password confirmation field is required.');
            done();
          });
      });

    it('Should not return the security details of the created User',
      () => {
        testData.testUser.password_confirmation = 'fakeuser';
        regularUser.should.not.have.property('password');
      });

    it('Should create a user without admin privileges', () => {
      regularUser.roleId.should.not.equal(1);
    });
  });

  describe('Login', () => {
    it('Should allow login for admin user with valid credentials', (done) => {
      app.post('/api/v1/users/login')
        .send({
          email: testData.adminUser.email,
          password: testData.adminUser.password
        })
        .end((error, response) => {
          adminToken = response.body.token;
          response.status.should.equal(200);
          response.body.token.should.be.an.instanceof(String);
          done();
        });
    });

    it('Should disallow login for invalid user password', (done) => {
      app.post('/api/v1/users/login')
        .send({
          email: testData.adminUser.email,
          password: 'invalidpassword'
        })
        .end((error, response) => {
          response.body.status.should.equal('fail');
          response.status.should.equal(401);
          response.body.message.should
            .equal('Authentication failed.');
          done();
        });
    });

    it('Should allow username or email with passoword for user login, \
not both', (done) => {
      app.post('/api/v1/users/login')
        .send({
          username: testData.adminUser.username,
          email: testData.adminUser.email,
          password: testData.adminUser.password
        })
        .end((error, response) => {
          response.body.status.should.equal('fail');
          response.body.message.should
            .equal('Supply either username or email, with your password');
          done();
        });
    });

    it('Should return a token if the user login is successful',
      () => {
        adminToken.split('.').length.should.equal(3);
      });

    it('Should allow user login with username',
      (done) => {
        app.post('/api/v1/users/login')
          .send({
            username: testData.adminUser.username,
            password: testData.adminUser.password
          })
          .end((error, response) => {
            response.status.should.equal(200);
            response.body.should.have.property('token').which.is.a.String();
            response.body.token.split('.').length.should.equal(3);
            done();
          });
      });

    it('Should not return a token if user login fails', (done) => {
      app.post('/api/v1/users/login')
        .send({
          email: testData.adminUser.email,
          password: 'invaidpassword'
        })
        .end((error, response) => {
          response.status.should.equal(401);
          response.body.status.should.equal('fail');
          response.body.should.not.have.property('token');
          done();
        });
    });

    it('Should return a token if the regular user login is successful',
      (done) => {
        testData.testUser.username = 'Andela';
        testData.testUser.email = 'ayo@gmail.com';
        testData.testUser.password = 'password';
        app.post('/api/v1/users/login')
          .send({
            email: testData.testUser.email,
            password: testData.testUser.password
          })
          .end((error, response) => {
            regularUserToken = response.body.token;
            response.status.should.equal(200);
            response.body.status.should.equal('success');
            response.body.should.have.property('token').which.is.a.String();
            response.body.token.split('.').length.should.equal(3);
            done();
          });
      });

    it('Should fail if login body includes any key other than username, \
password or email', (done) => {
      app.post('/api/v1/users/login')
        .send({
          emailer: testData.testUser.email,
          password: 'invaidpassword'
        })
        .end((error, response) => {
          response.status.should.equal(401);
          response.body.status.should.equal('fail');
          response.body.message.should
            .equal('Supply either username or email, with your password');
          done();
        });
    });
  });

  describe('Get User', () => {
    it('Should deny access to users data if accessed without a token',
      (done) => {
        app.get('/api/v1/users/1')
          .end((error, response) => {
            response.status.should.equal(401);
            response.body.status.should.equal('fail');
            response.body.message.should
              .equal('Token required to access this route');
            done();
          });
      });

    it('Should deny access to user with invalid token ',
      (done) => {
        app.get('/api/v1/users/1')
          .set({ 'x-access-token': 'regular.User.Token' })
          .end((error, response) => {
            response.status.should.equal(401);
            response.body.status.should.equal('fail');
            response.body.message.should
              .equal('Invalid token');
            done();
          });
      });

    it('Should not allow a non-admin access other users data', (done) => {
      app.get('/api/v1/users/1')
        .set({ 'x-access-token': regularUserToken })
        .end((error, response) => {
          response.status.should.equal(401);
          response.body.status.should.equal('fail');
          response.body.message.should
            .equal('You don\'t have authorization for this action');
          done();
        });
    });

    it('Should allow an admin user access to fetch any user data', (done) => {
      app.get(`/api/v1/users/${regularUser.id}`)
        .set({ 'x-access-token': adminToken })
        .end((error, response) => {
          response.status.should.equal(200);
          response.body.status.should.equal('success');
          response.body.data.should.have.property('id');
          response.body.data.should.have.property('username');
          response.body.data.should.have.property('roleId');
          response.body.data.should.have.property('firstname');
          response.body.data.should.have.property('lastname');
          response.body.data.should.have.property('email');
          done();
        });
    });

    it('Should allow a regular user access to fetch their user data',
      (done) => {
        app.get(`/api/v1/users/${regularUser.id}`)
          .set({ 'x-access-token': regularUserToken })
          .end((error, response) => {
            response.status.should.equal(200);
            response.body.status.should.equal('success');
            response.body.data.should.have.property('id');
            response.body.data.should.have.property('username');
            response.body.data.should.have.property('roleId');
            response.body.data.should.have.property('firstname');
            response.body.data.should.have.property('lastname');
            response.body.data.should.have.property('email');
            done();
          });
      });

    it('Should not return a user, if user with userId doesn\'t exist',
      (done) => {
        app.get('/api/v1/users/100000000')
          .set({ 'x-access-token': adminToken })
          .end((error, response) => {
            response.status.should.equal(404);
            response.body.status.should.equal('fail');
            response.body.message.should.equal('User does not exist');
            done();
          });
      });

    it('Should only allow valid numeric user id to be queried', (done) => {
      app.get('/api/v1/users/ab')
        .set({ 'x-access-token': adminToken })
        .end((error, response) => {
          response.status.should.equal(406);
          response.body.status.should.equal('fail');
          response.body.message.should
            .equal('Parameter supplied should be a number');
          done();
        });
    });
  });

  describe('Get All Users: ', () => {
    it('Should not allow a non-admin access all users data', (done) => {
      app.get('/api/v1/users/')
        .set({ 'x-access-token': regularUserToken })
        .end((error, response) => {
          response.status.should.equal(403);
          response.body.status.should.equal('fail');
          response.body.message.should
            .equal('User is unauthorized for this request.');
          done();
        });
    });

    it('Should allow an admin user access to fetch all users data', (done) => {
      app.get('/api/v1/users/')
        .set({ 'x-access-token': adminToken })
        .end((error, response) => {
          response.status.should.equal(200);
          response.body.status.should.equal('success');
          response.body.data.users.should.be.an.instanceOf(Array);
          response.body.data.paginationMeta.should.have.property('pageSize');
          response.body.data.paginationMeta.should.have.property('currentPage');
          response.body.data.users[0].should.have.property('id');
          response.body.data.users[0].should.have.property('username');
          response.body.data.users[0].should.have.property('roleId');
          response.body.data.users[0].should.have.property('firstname');
          response.body.data.users[0].should.have.property('lastname');
          response.body.data.users[0].should.have.property('email');
          done();
        });
    });

    it('Should not find any user for offset data above the database rows',
      (done) => {
        app.get('/api/v1/users?offset=10&&limit=5')
          .set({ 'x-access-token': adminToken })
          .end((error, response) => {
            response.status.should.equal(404);
            response.body.status.should.equal('fail');
            response.body.message.should.equal('No user found');
            done();
          });
      });
  });

  describe('Update User: ', () => {
    it('Should not allow user update if an invalid id is supplied',
      (done) => {
        app.patch('/api/v1/users/fffa')
          .set({ 'x-access-token': adminToken })
          .send(testData.testUserUpdate)
          .end((error, response) => {
            response.status.should.equal(406);
            response.body.status.should.equal('fail');
            response.body.message.should
              .equal('Parameter supplied should be a number');
            done();
          });
      });

    it('Should not allow user update if the user does not exist',
      (done) => {
        app.patch('/api/v1/users/1000')
          .set({ 'x-access-token': adminToken })
          .send(testData.testUserUpdate)
          .end((error, response) => {
            response.status.should.equal(404);
            response.body.status.should.equal('fail');
            response.body.message.should
              .equal('User does not exist');
            done();
          });
      });

    it('Should not allow user update if an invalid token is supplied',
      (done) => {
        app.patch(`/api/v1/users/${regularUser.id}`)
          .set({ 'x-access-token': 'regularUserToken' })
          .send(testData.testUserUpdate)
          .end((error, response) => {
            response.status.should.equal(401);
            response.body.status.should.equal('fail');
            response.body.message.should
              .equal('Invalid token');
            done();
          });
      });

    it('Should not allow user update if no token is supplied',
      (done) => {
        app.patch(`/api/v1/users/${regularUser.id}`)
          .send(testData.testUserUpdate)
          .end((error, response) => {
            response.status.should.equal(401);
            response.body.status.should.equal('fail');
            response.body.message.should
              .equal('Token required to access this route');
            done();
          });
      });

    it('Should not allow regular users update another users profile',
      (done) => {
        testData.adminUser.lastname = 'admin';
        app.patch('/api/v1/users/1')
          .set({ 'x-access-token': regularUserToken })
          .send(testData.adminUser)
          .end((error, response) => {
            response.status.should.equal(401);
            response.body.status.should.equal('fail');
            response.body.message.should
              .equal('You don\'t have authorization for this action');
            done();
          });
      });

    it(`Should not allow user to update profile if invalid update
fields are supplied`,
      (done) => {
        testData.testUserUpdate.invalidField = 'hello';
        app.patch(`/api/v1/users/${regularUser.id}`)
          .set({ 'x-access-token': regularUserToken })
          .send(testData.testUserUpdate)
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
        delete testData.testUserUpdate.invalidField;
        app.patch(`/api/v1/users/${regularUser.id}`)
          .set({ 'x-access-token': regularUserToken })
          .send(testData.testUserUpdate)
          .end((error, response) => {
            // response.status.should.equal(200);
            response.body.data.firstname.should.equal('Ayomide');
            done();
          });
      });

    it('Should not allow update of the roleId  of the default admin',
      (done) => {
        app.patch('/api/v1/users/1')
          .set({ 'x-access-token': adminToken })
          .send({ roleId: 1 })
          .end((error, response) => {
            response.status.should.equal(403);
            response.body.status.should.equal('fail');
            response.body.message.should
              .equal('You cannot change the default admin\'s role id');
            done();
          });
      });
  });

  describe('Change User Password: ', () => {
    it('Should not allow password change if an invalid id is supplied',
      (done) => {
        app.patch('/api/v1/users/fffa/password')
          .set({ 'x-access-token': adminToken })
          .send(testData.testUserChangePassword)
          .end((error, response) => {
            response.status.should.equal(406);
            response.body.status.should.equal('fail');
            response.body.message.should
              .equal('Parameter supplied should be a number');
            done();
          });
      });

    it('Should not allow admin change a user password if the user \
does not exist', (done) => {
      app.patch('/api/v1/users/10000/password')
        .set({ 'x-access-token': adminToken })
        .send(testData.testUserChangePassword)
        .end((error, response) => {
          response.status.should.equal(404);
          response.body.status.should.equal('fail');
          response.body.message.should
            .equal('User does not exist');
          done();
        });
    });

    it('Should not allow user change password if an invalid token is supplied',
      (done) => {
        app.patch(`/api/v1/users/${regularUser.id}/password`)
          .set({ 'x-access-token': 'regularUserToken' })
          .send(testData.testUserChangePassword)
          .end((error, response) => {
            response.status.should.equal(401);
            response.body.status.should.equal('fail');
            response.body.message.should
              .equal('Invalid token');
            done();
          });
      });

    it('Should not allow user change password if no token is supplied',
      (done) => {
        app.patch(`/api/v1/users/${regularUser.id}/password`)
          .send(testData.testUserChangePassword)
          .end((error, response) => {
            response.status.should.equal(401);
            response.body.status.should.equal('fail');
            response.body.message.should
              .equal('Token required to access this route');
            done();
          });
      });

    it('Should not allow regular users change another users password',
      (done) => {
        app.patch('/api/v1/users/1/password')
          .set({ 'x-access-token': regularUserToken })
          .send(testData.testUserChangePassword)
          .end((error, response) => {
            response.status.should.equal(401);
            response.body.status.should.equal('fail');
            response.body.message.should
              .equal('You don\'t have authorization for this action');
            done();
          });
      });

    it('Should not allow user to change password if invalid fields\
are supplied',
      (done) => {
        testData.testUserChangePassword.invalidField = 'hello';
        app.patch(`/api/v1/users/${regularUser.id}/password`)
          .set({ 'x-access-token': regularUserToken })
          .send(testData.testUserChangePassword)
          .end((error, response) => {
            response.status.should.equal(400);
            response.body.status.should.equal('fail');
            response.body.message.should
              .equal('Badly formatted request body including ( invalidField )');
            done();
          });
      });

    it('Should not allow password change if wrong current password provided',
      (done) => {
        delete testData.testUserChangePassword.invalidField;
        testData.testUserChangePassword.old_password = 'wrongpassword';
        app.patch(`/api/v1/users/${regularUser.id}/password`)
          .set({ 'x-access-token': regularUserToken })
          .send(testData.testUserChangePassword)
          .end((error, response) => {
            response.status.should.equal(400);
            response.body.status.should.equal('fail');
            response.body.message.should
              .equal('Incorrect current password');
            done();
          });
      });

    it('Should not change password if new password is not same with \
new password confirmation', (done) => {
      testData.testUserChangePassword.old_password = 'password';
      testData.testUserChangePassword.new_password = 'password';
      app.patch(`/api/v1/users/${regularUser.id}/password`)
        .set({ 'x-access-token': regularUserToken })
        .send(testData.testUserChangePassword)
        .end((error, response) => {
          response.status.should.equal(400);
          response.body.status.should.equal('error');
          response.body.errors[0].should
            .equal('The new password confirmation does not match.');
          done();
        });
    });

    it('Should not change password if new password is same with current \
password', (done) => {
      testData.testUserChangePassword.new_password_confirmation = 'password';
      app.patch(`/api/v1/users/${regularUser.id}/password`)
        .set({ 'x-access-token': regularUserToken })
        .send(testData.testUserChangePassword)
        .end((error, response) => {
          response.status.should.equal(400);
          response.body.status.should.equal('fail');
          response.body.message.should
            .equal('Current password can\'t be same with new password');
          done();
        });
    });

    it('Should allow a user change password if valid Token provided',
      (done) => {
        testData.testUserChangePassword.new_password = 'password1';
        testData.testUserChangePassword.new_password_confirmation = 'password1';
        app.patch(`/api/v1/users/${regularUser.id}/password`)
          .set({ 'x-access-token': regularUserToken })
          .send(testData.testUserChangePassword)
          .end((error, response) => {
            response.status.should.equal(200);
            response.body.message.should
              .equal('Password changed successfully');
            done();
          });
      });
  });

  describe('Delete User: ', () => {
    it('Should not allow a non-admin user to delete a user',
      (done) => {
        app.delete(`/api/v1/users/${regularUser.id}`)
          .set({ 'x-access-token': regularUserToken })
          .end((error, response) => {
            response.status.should.equal(403);
            response.body.status.should.equal('fail');
            response.body.message.should
              .equal('User is unauthorized for this request.');
            done();
          });
      });

    it('Should not allow an admin user with an in-Valid token delete a user',
      (done) => {
        app.delete(`/api/v1/users/${regularUser.id}`)
          .set({ 'x-access-token': 'invalidToken' })
          .end((error, response) => {
            response.status.should.equal(401);
            response.body.status.should.equal('fail');
            response.body.message.should.equal('Invalid token');
            done();
          });
      });

    it('Should not allow the deletion of the default admin account',
      (done) => {
        app.delete('/api/v1/users/1')
          .set({ 'x-access-token': adminToken })
          .end((error, response) => {
            response.status.should.equal(403);
            response.body.status.should.equal('fail');
            response.body.message.should
              .equal('You cannot delete the default admin account');
            done();
          });
      });

    it('Should allow an admin user with a valid token to delete any user',
      (done) => {
        app.delete(`/api/v1/users/${regularUser.id}`)
          .set({ 'x-access-token': adminToken })
          .end((error, response) => {
            response.status.should.equal(200);
            response.body.status.should.equal('success');
            response.body.message.should
              .equal('User deleted successfully');
            done();
          });
      });

    it('Should return a user does not exist message if admin tries to \
delete a non existing user', (done) => {
      app.delete(`/api/v1/users/${regularUser.id}`)
        .set({ 'x-access-token': adminToken })
        .end((error, response) => {
          response.status.should.equal(404);
          response.body.status.should.equal('fail');
          response.body.message.should
            .equal('User does not exist');
          done();
        });
    });
  });

  describe('Logout', () => {
    it('should successfully logout a user with a valid token',
      (done) => {
        app.post('/api/v1/users/logout')
          .set({ 'x-access-token': adminToken })
          .end((error, response) => {
            response.status.should.equal(200);
            response.body.status.should.equal('success');
            response.body.message.should.equal('Successfully logged out.');
            done();
          });
      });
  });
});
