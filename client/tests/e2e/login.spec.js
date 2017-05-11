/* eslint-disable no-unused-vars*/
import variables from './config';
import config from '../../../nightwatch.conf';

export default {

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
