const faker = require('faker');

module.exports = {
  up: (queryInterface, Sequelize) => {
    const initialDocuments = [];
    const idArray = [1, 2, 3, 4, 5];
    const accessArray = ['private', 'public', 'role'];

    let DocumentId = 1;
    for (let i = 0; i <= 10; i += 1) {
      initialDocuments.push({
        id: DocumentId,
        creatorId: idArray[Math.floor(Math.random() * idArray.length)],
        title: faker.company.catchPhrase(),
        content: faker.lorem.paragraph(),
        access: accessArray[Math.floor(Math.random() * accessArray.length)],
        createdAt: new Date(),
        updatedAt: new Date()
      });
      DocumentId += 1;
    }

    return queryInterface.bulkInsert('Documents', initialDocuments, {
      returning: true
    });
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.bulkDelete('Documents', null, {});
  }
};
