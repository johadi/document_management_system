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
    })
    .catch((error) => {
      console.log(error);
    });
  },
  after: () => {
    db.sequelize.sync({ force: true });
  },

  // beforeEach: (browser) => {
  //   browser
  //     .url(`${config.url}`)
  //     .waitForElementVisible('body', 1000)
  //     .setValue('input[type=email]', 'emmatope@gmail.com')
  //     .setValue('input[type=password]', 'Andela_1')
  //     .click('button[type=submit]')
  //     .pause(1000)
  //     .assert.urlEquals(`${variables.url}/dashboard`);
  // },

  'Create Document': (browser) => {
    browser
      .url(variables.url)
      .waitForElementVisible('body')
      .setValue('input[type=email]', 'emmatope@gmail.com')
      .setValue('input[type=password]', 'Andela_1')
      .click('button[type="submit"]')
      .pause(1500)
      .assert.urlEquals(`${variables.url}/dashboard`)
      .url(`${variables.url}/document`)
      .waitForElementVisible('body')
      .assert.containsText('h4', 'Create A Document')
      .waitForElementVisible('body')
      .assert.elementPresent('#access')
      .pause(500)
      .setValue('input#title', 'Cool Title')
      .click('select[id="access"] option[value="public"]')
      .setValue('textarea', 'cool title content')
      .pause(1500)
      .click('button[type="submit"]')
      .pause(1500)
      .assert.urlEquals(`${variables.url}/dashboard`)
      .end();
  },
  // 'Edit Document': function (browser) {
  //   browser
  //     .url('http://localhost:3000')
  //     .waitForElementVisible('body')
  //     .setValue('input[type=email]', 'admin@admin.com')
  //     .setValue('input[type=password]', 'Kratus043')
  //     .click('button[type="submit"]')
  //     .pause(1500)
  //     .assert.urlEquals('http://localhost:3000/admindashboard')
  //     .click('table#document-list tbody tr:first-of-type i.edit-btn')
  //     .waitForElementVisible('body')
  //     .clearValue('input#title')
  //     .setValue('input#title', 'Freemile One More Title')
  //     .click('button[type="submit"]')
  //     .pause(2000)
  //     .assert.urlEquals('http://localhost:3000/admindashboard')
  //     .waitForElementVisible('body')
  //     .waitForElementVisible('table#document-list')
  //     .assert.containsText('table#document-list tr:first-of-type>td.doc-title',
  //     'Freemile One More Title')
  //     .end();
  // },
  // 'Delete Document': function (browser) {
  //   browser
  //     .url('http://localhost:3000')
  //     .waitForElementVisible('body')
  //     .setValue('input[type=email]', 'admin@admin.com')
  //     .setValue('input[type=password]', 'Kratus043')
  //     .click('button[type="submit"]')
  //     .pause(1000)
  //     .assert.urlEquals('http://localhost:3000/admindashboard')
  //     .click('table#document-list tbody tr:first-of-type i.edit-btn')
  //     .waitForElementVisible('body')
  //     .clearValue('input#title')
  //     .setValue('input#title', 'Chosen One')
  //     .click('button[type="submit"]')
  //     .pause(1000)
  //     .assert.urlEquals('http://localhost:3000/admindashboard')
  //     .waitForElementVisible('body')
  //     .click('table#document-list tbody tr:first-of-type i.delete-btn')
  //     .pause(500)
  //     .waitForElementVisible('button.confirm')
  //     .click('button.confirm')
  //     .expect.element('table#document-list tr:first-of-type>td.doc-title')
  //     .text.to.not.equal('Chosen One');
  //   browser.end();
  // }
};
