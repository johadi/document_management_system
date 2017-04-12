import faker from 'faker';

const data = {
  adminRole: {
    id: 1,
    title: 'admin'
  },
  regularRole: {
    id: 2,
    title: 'regular'
  },
  roleDeleteTitle: {
    title: faker.lorem.word()
  },
  testRole3: {
    title: faker.lorem.word()
  },
  adminUser: {
    username: 'Andela_1',
    firstname: 'Emmanuel',
    lastname: 'Shaibu',
    email: 'emmagd4@gmail.com',
    password: 'password',
    password_confirmation: 'password'
  },
  validUser: {
    username: 'Andela123',
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
    password: 'password'
  },
  testUserUpdate: {
    username: 'Andela12',
    firstname: 'Ayomide',
    lastname: 'Shaibu'
  },
  testUserChangePassword: {
    old_password: 'password',
    new_password: 'password1',
    new_password_confirmation: 'password1'
  },
  userNoFirstName: {
    username: faker.internet.userName(),
    lastname: faker.name.lastName(),
    email: faker.internet.email(),
    password: 'password',
    roleId: 2
  },
  userNoLastName: {
    username: faker.internet.userName(),
    firstname: faker.name.firstName(),
    email: faker.internet.email(),
    password: 'password',
    roleId: 2
  },
  testDoc: {
    creatorId: 1,
    title: faker.lorem.sentence(),
    content: faker.lorem.paragraph(),
    access: 'private'
  },
  testDocCRUD: {
    creatorId: 1,
    title: faker.lorem.word(),
    content: faker.lorem.paragraph(),
    access: 'private'
  },
  testDocNoAccess: {
    creatorId: 1,
    title: faker.lorem.sentence(),
    content: faker.lorem.paragraph()
  },
  testDocNoTitle: {
    creatorId: 1,
    content: faker.lorem.paragraph(),
    access: 'public'
  },
  testDocNoContent: {
    creatorId: 1,
    title: faker.lorem.word(),
    access: 'role'
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
