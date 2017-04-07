import faker from 'faker';

const data = {
  adminRole: {
    id: 1,
    title: 'admin'
  },

  testRole2: {
    title: 'regular'
  },
  newRole1: {
    title: faker.lorem.word()
  },
  newRole2: {
    title: faker.lorem.word()
  },
  validUser: {
    username: faker.internet.userName(),
    firstname: faker.name.firstName(),
    lastname: faker.name.lastName(),
    email: faker.internet.email(),
    password: 'password',
    roleId: 1
  },
  testUser: {
    username: 'Andela',
    firstname: 'Ayobami',
    lastname: 'Shaibu',
    email: 'ayo@gmail.com',
    password: 'password',
    roleId: 1
  },
  testUser2: {
    username: faker.internet.userName(),
    firstname: faker.name.firstName(),
    lastname: faker.name.lastName(),
    email: faker.internet.email(),
    password: 'password',
    roleId: 2
  },
  testUser3: {
    username: faker.internet.userName(),
    firstname: faker.name.firstName(),
    lastname: faker.name.lastName(),
    email: faker.internet.email(),
    password: 'password',
    roleId: 2
  },
  invalidEmail: {
    username: faker.internet.userName(),
    firstname: faker.name.firstName(),
    lastname: faker.name.lastName(),
    email: 'tope123',
    password: 'password',
    roleId: 2
  },
  longTitle: 'rNwj0DTYKDtgutzStfGsBpBiQK3ZZoM1eNlMB\
6wPrt6vZPgPMjrCurSpoFkFCIqQQBoyrOh9D4zSzcKFAYoVY3LG9h8hTWuJo5nz6huPibG1pZJTgfz\
jNpWiAgO1GQZL94s8pwWkPURfmReJYbjM5tV4wbJgg1XpCqJs5BYHR8xxceyErcbzrvyAngOyBsSKa\
IESk29cuhEQTHhMy0FuZ1lSiUrUTXIrpEHVG9isLTNSNjLl14iFjaefKGlIEK7AHp3PK1J5GWlP6C6\
ORw725yayXevXWLbAMpgghghghghghghghghhghhghghhghgghghghghghghghghhghghghghghgh',
  longEmail: 'rNwj0DTYKDtgutzStfGsBpBiQK3ZZoM1eNlMBamT36\
6wPrt6vZPgPMjrCurSpoFkFCIqQQBoyrOh9D4zSzcKFAYoVY3LG9h8hTWuJo5nz6huPibG1pZJTgfz\
jNpWiAgO1GQZL94s8pwWkPURfmReJYbjM5tV4wbJgg1XpCqJs5BYHR8xxceyErcbzrvyAngOyBsSKa\
IESk29cuhEQTHhMy0FuZ1lSiUrUTXIrpEHVG9isLTNSNjLl14iFjaefKGlIEK7AHp3PK1J5GWlP6C6\
ORw725yayXevXWLbAMp@yahoo.com'
};
export default data;
