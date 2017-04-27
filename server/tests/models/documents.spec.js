import { db, testData } from '../helpers.spec';

describe('Document Model: ', () => {
  before((done) => {
    db.Role.create(testData.adminRole)
    .then((createdRole) => {
      testData.validUser.roleId = createdRole.id;
      return db.User.create(testData.validUser);
    })
    .then((createdUser) => {
      testData.testDoc.creatorId = createdUser.id;
      return db.Document.create(testData.testDoc);
    })
    .then(() => {
      done();
    });
  });

  after(() => db.sequelize.sync({ force: true }));

  describe('Validations: ', () => {
    describe('CreatorId: ', () => {
      it('should be a integer', (done) => {
        testData.testDoc.creatorId = 'a';
        db.Document.create(testData.testDoc)
          .catch((error) => {
            error.errors[0].message.should
              .equal('creatorId must be an integer');
            testData.testDoc.creatorId = 1;
            done();
          });
      });
    });

    describe('Title: ', () => {
      it('should not allow input without title property', (done) => {
        db.Document.create(testData.testDocNoTitle)
          .catch((error) => {
            error.errors[0].message.should
              .equal('title cannot be null');
            done();
          });
      });

      it('should not allow titles less than 3 characters', (done) => {
        testData.testDoc.title = 'He';
        db.Document.create(testData.testDoc)
        .catch((error) => {
          error.errors[0].message.should
            .equal('Title length should range between 3 - 254 characters');
          done();
        });
      });

      it('should not allow titles longer than 254 characters', (done) => {
        testData.testDoc.title = testData.longTitle;
        db.Document.create(testData.testDoc)
        .catch((error) => {
          error.errors[0].message.should
            .equal('Title length should range between 3 - 254 characters');
          testData.testDoc.title = 'hello world';
          done();
        });
      });
    });

    describe('Content: ', () => {
      it('should not allow input without content property', (done) => {
        db.Document.create(testData.testDocNoContent)
          .catch((error) => {
            error.errors[0].message.should
              .equal('content cannot be null');
            done();
          });
      });

      it('should not allow empty document contents', (done) => {
        testData.testDoc.content = '';
        db.Document.create(testData.testDoc)
          .catch((error) => {
            error.errors[0].message.should
              .equal('Content cannot be empty');
            testData.testDoc.content = testData.longTitle;
            done();
          });
      });
    });

    describe('Access: ', () => {
      it('should only allow public, private, or users in access field',
        (done) => {
          testData.testDoc.access = 'permission';
          db.Document.create(testData.testDoc)
            .catch((error) => {
              error.errors[0].message.should
                .equal('Access can only be private, public or role');
              delete testData.testDoc.access;
              testData.testDoc.creatorId = 1;
              done();
            });
        });
    });
  });

  describe('CRUD: ', () => {
    let newDocument;
    describe('Create', () => {
      it('should create a new document', (done) => {
        db.Document.create(testData.testDocCRUD)
          .then((document) => {
            newDocument = document.dataValues;
            document.dataValues.should.have.property('id').which.is.a.Number();
            document.dataValues.should.have.property('access')
              .which.is.equal('private');
            done();
          });
      });

      it('should create a private document if access is not supplied',
        (done) => {
          db.Document.create(testData.testDocNoAccess)
            .then((document) => {
              newDocument = document.dataValues;
              document.dataValues.should.have.property('id')
                .which.is.a.Number();
              document.dataValues.should.have.property('access')
                .which.is.equal('private');
              done();
            });
        });
    });

    describe('Read: ', () => {
      it('should get user details', (done) => {
        db.Document.findById(newDocument.id)
          .then((document) => {
            document.should.have.property('id').which.is.equal(newDocument.id);
            done();
          });
      });
    });

    describe('Update: ', () => {
      it('should update a document', (done) => {
        db.Document.findById(newDocument.id)
          .then((document) => {
            document.update({ title: 'updated document title' })
              .then((updatedDocument) => {
                updatedDocument.should.have.property('title')
                  .which.is.equal('updated document title');
                done();
              });
          });
      });
    });

    describe('Delete: ', () => {
      it('should delete a document', (done) => {
        db.Document.destroy({ where: { id: newDocument.id } })
        .then((deleted) => {
          deleted.should.equal(1);
          done();
        });
      });
    });
  });
});

