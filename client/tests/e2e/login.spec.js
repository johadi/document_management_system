/*eslint-disable no-unused-vars*/
import config from '../../../nightwatch.conf';

export default {
  'Login Page': function (browser) {
    browser
      .url('http://localhost:8000')
      .waitForElementVisible('body')
      .assert.title('DMS')
      .setValue('input[type=email]', 'emmatope@gmail.com')
      .setValue('input[type=password]', 'Andela_1')
      .click('button[type="submit"]')
      .saveScreenshot('screenshots/loginPage.png')
      .pause(1500)
      .assert.urlEquals('http://localhost:8000/dashboard')
      .click('#logout')
      .pause(1000)
      .assert.urlEquals('http://localhost:8000/')
      .end();
  }
};
