import { db, testData } from '../helpers.spec';

describe('User Model: ', () => {
  before((done) => {
    db.Role.create(testData.adminRole)
    .then((createdRole) => {
      testData.testUser.roleId = createdRole.id;
      return db.User.create(testData.testUser);
    })
    .then(() => {
      done();
    });
  });

  after(() => db.sequelize.sync({ force: true }));

  describe('Validations: ', () => {
    describe('Username: ', () => {
      it('should not allow duplicate usernames', (done) => {
        testData.testUser.email = 'emmatope@andela.com';
        db.User.create(testData.testUser)
        .catch((error) => {
          error.errors[0].message.should
            .equal('Oops. There is an existing account with this username.');
          done();
        });
      });

      it('should not allow usernames longer than 40 characters', (done) => {
        testData.testUser.username = testData.longTitle;
        db.User.create(testData.testUser)
        .catch((error) => {
          error.errors[0].message.should
            .equal('Username length should range between 6 - 40 characters');
          done();
        });
      });

      it('should not allow usernames less than 6 characters', (done) => {
        testData.testUser.username = 'de';
        db.User.create(testData.testUser)
        .catch((error) => {
          error.errors[0].message.should
            .equal('Username length should range between 6 - 40 characters');
          testData.testUser.username = 'testUser';
          done();
        });
      });
    });

    describe('Firstname: ', () => {
      it('should not allow input without firstnames property', (done) => {
        db.User.create(testData.userNoFirstName)
        .catch((error) => {
          error.errors[0].message.should
            .equal('firstname cannot be null');
          done();
        });
      });

      it('should not allow firstnames longer than 40 characters', (done) => {
        testData.testUser.firstname = testData.longTitle;
        db.User.create(testData.testUser)
        .catch((error) => {
          error.errors[0].message.should
            .equal('First Name length should range between 2 - 40 characters');
          done();
        });
      });

      it('should not allow firstnames less than 2 characters', (done) => {
        testData.testUser.firstname = 'c';
        db.User.create(testData.testUser)
        .catch((error) => {
          error.errors[0].message.should
            .equal('First Name length should range between 2 - 40 characters');
          testData.testUser.firstname = 'Emmanuel';
          done();
        });
      });
    });

    describe('Lastname: ', () => {
      it('should not allow input without lastnames property', (done) => {
        db.User.create(testData.userNoLastName)
          .catch((error) => {
            error.errors[0].message.should
              .equal('lastname cannot be null');
            done();
          });
      });

      it('should not allow lastnames longer than 40 characters', (done) => {
        testData.testUser.lastname = testData.longTitle;
        db.User.create(testData.testUser)
        .catch((error) => {
          error.errors[0].message.should
            .equal('Last Name length should range between 2 - 40 characters');
          done();
        });
      });

      it('should not allow lastnames less than 2 characters', (done) => {
        testData.testUser.lastname = 'e';
        db.User.create(testData.testUser)
        .catch((error) => {
          error.errors[0].message.should
            .equal('Last Name length should range between 2 - 40 characters');
          testData.testUser.lastname = 'Shaibu';
          done();
        });
      });
    });

    describe('Email: ', () => {
      it('should not allow duplicate emails', (done) => {
        testData.testUser.email = 'ayo@gmail.com';
        db.User.create(testData.testUser)
        .catch((error) => {
          error.errors[0].message.should
            .equal('Oops. There is an existing account with this email.');
          done();
        });
      });

      it('should not allow invalid emails', (done) => {
        testData.testUser.email = 'ce';
        db.User.create(testData.testUser)
        .catch((error) => {
          error.errors[0].message.should
            .equal('The email you entered is invalid.');
          done();
        });
      });

      it('should not allow emails longer than 254 characters', (done) => {
        testData.testUser.email = testData.longEmail;
        db.User.create(testData.testUser)
        .catch((error) => {
          error.errors[0].message.should
            .equal('The email you entered is invalid.');
          testData.testUser.email = 'emmatope@andela.com';
          done();
        });
      });
    });

    describe('RoleId: ', () => {
      it('should only allow empty roleId', (done) => {
        testData.testUser.roleId = '';
        db.User.create(testData.testUser)
        .catch((error) => {
          error.errors[0].message.should
            .equal('Role id is required');
          done();
        });
      });
    });

    describe('Password: ', () => {
      it('should not allow passwords less than six characters', (done) => {
        testData.testUser.roleId = 1;
        testData.testUser.password = 'pass';
        db.User.create(testData.testUser)
        .catch((error) => {
          error.errors[0].message.should
            .equal('Your password cannot be less than 6 characters');
          testData.testUser.password = 'password2';
          done();
        });
      });
    });
  });

  describe('CRUD: ', () => {
    let newUser;
    describe('Create', () => {
      it('should create a user account', (done) => {
        db.User.create(testData.validUser)
          .then((user) => {
            newUser = user.dataValues;
            user.dataValues.should.have.property('id').which.is.a.Number();
            done();
          });
      });
    });

    describe('Read: ', () => {
      it('should get user details', (done) => {
        db.User.findById(newUser.id)
        .then((user) => {
          user.should.have.property('id').which.is.equal(newUser.id);
          done();
        });
      });
    });

    describe('Update: ', () => {
      it('should update a user account', (done) => {
        db.User.findById(newUser.id)
        .then((user) => {
          user.update({ firstname: 'updatedfirstname' })
            .then((updatedUser) => {
              updatedUser.should.have.property('firstname')
                .which.is.equal('updatedfirstname');
              done();
            });
        });
      });
    });

    describe('Delete: ', () => {
      it('should delete a user account', (done) => {
        db.User.destroy({ where: { id: newUser.id } })
          .then((deleted) => {
            deleted.should.equal(1);
            done();
          });
      });
    });
  });
});
