/* eslint-disable no-unused-vars*/
import faker from 'faker';
import variables from './config';
import config from '../../../nightwatch.conf';

export default {
  beforeEach: (browser) => {
    browser
      .url(variables.url)
      .waitForElementVisible('body', 1000)
      .setValue('input[type=email]', 'emmatope@gmail.com')
      .setValue('input[type=password]', 'Andela_1')
      .click('button[type="submit"]')
      .pause(1500)
      .assert.urlEquals(`${variables.url}/dashboard`)
      .waitForElementVisible('.link-users', 3000);
  },
  'View users': (browser) => {
    browser
      .url(`${variables.url}/users`)
      .pause(2000)
      .assert.urlEquals(`${variables.url}/users`)
      .waitForElementVisible('div[class="collection_list"]')
      .assert.containsText('h4', 'Users')
      .waitForElementVisible('div[class="collection_list"] ul:first-of-type span.title')
      .end();
  },
  after: browser => browser.end()
};
