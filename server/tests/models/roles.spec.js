import { db, testData } from '../helpers.spec';

describe('Role Model: ', () => {
  before((done) => {
    db.Role.create(testData.adminRole)
      .then(() => done());
  });

  after(() => db.sequelize.sync({ force: true }));

  describe('Validations: ', () => {
    describe('Title: ', () => {
      it('should not allow input without title property', (done) => {
        delete testData.roleDeleteTitle.title;
        db.Role.create(testData.roleDeleteTitle)
          .catch((error) => {
            error.errors[0].message.should
              .equal('title cannot be null');
            done();
          });
      });

      it('should not allow duplicate id', (done) => {
        db.Role.create(testData.adminRole)
          .catch((error) => {
            error.errors[0].message.should
              .equal('id must be unique');
            done();
          });
      });

      it('should not allow duplicate titles', (done) => {
        testData.adminRole.id = 3;
        db.Role.create(testData.adminRole)
          .catch((error) => {
            error.errors[0].message.should
              .equal('This role tile already exists');
            done();
          });
      });

      it('should not allow role titles longer than 254 characters', (done) => {
        testData.adminRole.title = testData.longTitle;
        db.Role.create(testData.adminRole)
          .catch((error) => {
            error.errors[0].message.should
              .equal('Title length should range between 3 - 254 characters');
            done();
          });
      });

      it('should not allow title less than 3 characters', (done) => {
        testData.adminRole.title = 'de';
        db.Role.create(testData.adminRole)
          .catch((error) => {
            error.errors[0].message.should
              .equal('Title length should range between 3 - 254 characters');
            testData.adminRole.title = 'admin';
            done();
          });
      });
    });
  });

  describe('CRUD: ', () => {
    let newRole;
    describe('Create', () => {
      it('should create a role', (done) => {
        db.Role.create(testData.regularRole)
          .then((role) => {
            newRole = role.dataValues;
            role.dataValues.should.have.property('id').which.is.a.Number();
            done();
          });
      });
    });

    describe('Read: ', () => {
      it('should get role details', (done) => {
        db.Role.findById(newRole.id)
          .then((role) => {
            role.should.have.property('id').which.is.equal(newRole.id);
            done();
          });
      });
    });

    describe('Update: ', () => {
      it('should update a role title', (done) => {
        db.Role.findById(newRole.id)
          .then((role) => {
            role.update({ title: 'updatedtitle' })
              .then((updatedRole) => {
                updatedRole.should.have.property('title')
                  .which.is.equal('updatedtitle');
                done();
              });
          });
      });
    });

    describe('Delete: ', () => {
      it('should delete a role', (done) => {
        db.Role.destroy({ where: { id: newRole.id } })
          .then((deleted) => {
            deleted.should.equal(1);
            done();
            testData.adminRole.id = 1;
          });
      });
    });
  });
});
