const bcrypt = require('bcrypt-nodejs');
const faker = require('faker');
const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  up: (queryInterface, Sequelize) => {
    const initialUsers = [
      {
        id: 1,
        firstname: process.env.SUPER_ADMIN_FIRSTNAME,
        lastname: process.env.SUPER_ADMIN_LASTNAME,
        username: process.env.SUPER_ADMIN_USERNAME,
        email: process.env.SUPER_ADMIN_EMAIL,
        password: bcrypt.hashSync(process.env.SUPER_ADMIN_PASSWORD,
          bcrypt.genSaltSync(8)),
        roleId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        firstname: process.env.ADMIN_FIRSTNAME,
        lastname: process.env.ADMIN_LASTNAME,
        username: process.env.ADMIN_USERNAME,
        email: process.env.ADMIN_EMAIL,
        password: bcrypt.hashSync(process.env.ADMIN_PASSWORD,
          bcrypt.genSaltSync(8)),
        roleId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    let UserId = 3;
    for (let i = 0; i <= 5; i += 1) {
      initialUsers.push({
        id: UserId,
        firstname: faker.name.firstName(),
        lastname: faker.name.lastName(),
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: bcrypt.hashSync('password', bcrypt.genSaltSync(8)),
        roleId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      UserId += 1;
    }

    return queryInterface.bulkInsert('Users', initialUsers, {
      returning: true
    });
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.bulkDelete('Users', null, {});
  }
};
