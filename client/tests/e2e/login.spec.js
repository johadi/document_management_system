/* eslint-disable no-unused-vars*/
import variables from './config';
import config from '../../../nightwatch.conf';

export default {
  beforeEach: (browser) => {
    browser
      .url(variables.url)
      .waitForElementVisible('body', 1000);
  },
  'Invalid user': (browser) => {
    browser
      .setValue('input[type=email]', 'invalid@gmail.com')
      .setValue('input[type=password]', 'password')
      .click('button[type=submit]')
      .pause(1000)
      .assert.visible('#card-alert')
      .assert.urlEquals(`${variables.url}/`);
  },
  'Login User': (browser) => {
    browser
      .assert.title('DMS')
      .setValue('input[type=email]', 'emmatope@gmail.com')
      .setValue('input[type=password]', 'Andela_1')
      .click('button[type="submit"]')
      .saveScreenshot('screenshots/loginPage.png')
      .pause(1000)
      .assert.urlEquals(`${variables.url}/dashboard`)
      .click('#dropbtn')
      .pause(1000)
      .click('#logout')
      .pause(1000)
      .assert.urlEquals(`${variables.url}/`);
  },
  after: browser => browser.end()
};
