/* eslint-disable no-unused-vars*/
import variables from './config';
import config from '../../../nightwatch.conf';
import db from '../../../server/models';
import testData from '../../../server/tests/data.spec';

export default {
  '@disable': true,
  before: () => {
    delete testData.adminRole.id;
    db.Role.create(testData.adminRole)
      .then((createdRole) => {
        testData.testUser.roleId = createdRole.id;
        db.User.create(testData.testUser);
      });
  },
  after: () => {
    db.sequelize.sync({ force: true });
  },

  'Login Page': (browser) => {
    browser
      .url(variables.url)
      .waitForElementVisible('body')
      .assert.title('DMS')
      .setValue('input[type=email]', 'emmatope@gmail.com')
      .setValue('input[type=password]', 'Andela_1')
      .click('button[type="submit"]')
      .saveScreenshot('screenshots/loginPage.png')
      .pause(1500)
      .assert.urlEquals(`${variables.url}/dashboard`)
      .click('#dropbtn')
      .pause(1000)
      .click('#logout')
      .pause(1000)
      .assert.urlEquals(`${variables.url}/`)
      .end();
  }
};
