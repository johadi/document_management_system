/* eslint-disable no-unused-vars*/
import variables from './config';
import config from '../../../nightwatch.conf';

export default {
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
      .pause(500)
      .click('button[type="submit"]')
      .end();
  }
};
