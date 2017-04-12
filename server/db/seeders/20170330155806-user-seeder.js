const bcrypt = require('bcrypt-nodejs');
const faker = require('faker');
const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  up: (queryInterface, Sequelize) => {
    const initialUsers = [
      {
        firstname: process.env.ADMIN_FIRSTNAME,
        lastname: process.env.ADMIN_LASTNAME,
        username: process.env.ADMIN_USERNAME,
        email: process.env.ADMIN_EMAIL.toLowerCase(),
        password: bcrypt.hashSync(process.env.ADMIN_PASSWORD,
          bcrypt.genSaltSync(8)),
        roleId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        firstname: process.env.ADMIN_FIRSTNAME2,
        lastname: process.env.ADMIN_LASTNAME2,
        username: process.env.ADMIN_USERNAME2,
        email: process.env.ADMIN_EMAIL2.toLowerCase(),
        password: bcrypt.hashSync(process.env.ADMIN_PASSWORD,
          bcrypt.genSaltSync(8)),
        roleId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    for (let i = 0; i <= 5; i += 1) {
      initialUsers.push({
        firstname: faker.name.firstName(),
        lastname: faker.name.lastName(),
        username: faker.internet.userName(),
        email: faker.internet.email().toLowerCase(),
        password: bcrypt.hashSync('password', bcrypt.genSaltSync(8)),
        roleId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    return queryInterface.bulkInsert('Users', initialUsers, {
      returning: true
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
