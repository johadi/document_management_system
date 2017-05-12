/* eslint-disable no-unused-vars*/
import faker from 'faker';
import variables from './config';
import config from '../../../nightwatch.conf';

export default {
  beforeEach: (browser) => {
    browser
      .url(`${variables.url}/register`)
      .waitForElementVisible('body', 1000);
  },
  'Invalid signup': (browser) => {
    browser
      .setValue('input#username', 'an')
      .setValue('input#firstname', 'andela')
      .setValue('input#lastname', 'Tope')
      .setValue('input#email', 'qwer@gmail.com')
      .setValue('input#password', 'password')
      .setValue('input#password_confirmation', 'password1')
      .click('button[type=submit]')
      .assert.visible('#card-alert')
      .assert.urlEquals(`${variables.url}/register`)
      .end();
  },
  'Register User': (browser) => {
    browser
      .assert.title('DMS')
      .setValue('input#username', `temitope${faker.internet.userName()}`)
      .setValue('input#firstname', faker.name.firstName())
      .setValue('input#lastname', faker.name.lastName())
      .setValue('input#email', faker.internet.email())
      .setValue('input#password', 'password')
      .setValue('input#password_confirmation', 'password')
      .click('button[type="submit"]')
      .pause(1500)
      .assert.urlEquals(`${variables.url}/dashboard`)
      .waitForElementVisible('body')
      .end();
  },
  after: browser => browser.end()
};
