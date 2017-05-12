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
  'Create User': (browser) => {
    browser
      .url(`${variables.url}/user`)
      .setValue('input#username', `temitope${faker.internet.userName()}`)
      .setValue('input#firstname', 'Abigail')
      .setValue('input#lastname', 'Good')
      .setValue('input#email', faker.internet.email())
      .setValue('input#password', 'password')
      .setValue('input#password_confirmation', 'password')
      .click('button[type="submit"]')
      .pause(1500)
      .assert.urlEquals(`${variables.url}/users`)
      .waitForElementVisible('body')
      .end();
  },
  'Edit User': (browser) => {
    browser
      .url(`${variables.url}/user/2/edit`)
      .clearValue('input#firstname')
      .setValue('input#firstname', 'Ayobami')
      .clearValue('input#lastname')
      .setValue('input#lastname', 'Ayomide')
      .click('button[type="submit"]')
      .pause(1500)
      .assert.urlEquals(`${variables.url}/users`)
      .waitForElementVisible('body')
      .end();
  },
  'View user': (browser) => {
    browser
      .url(`${variables.url}/user/2`)
      .pause(2000)
      .assert.urlEquals(`${variables.url}/user/2`)
      .waitForElementVisible('div#profile-name')
      .assert.containsText('div#profile-name', 'Ayomide Ayobami')
      .end();
  },
  'View users': (browser) => {
    browser
      .url(`${variables.url}/users`)
      .pause(2000)
      .assert.urlEquals(`${variables.url}/users`)
      .waitForElementVisible('div[class="collection_list"]')
      .assert.containsText('h4', 'Users')
      .assert.containsText('div[class="collection_list"] ul:first-of-type span.title > a', 'Good Abigail')
      .end();
  },
  'Search user': (browser) => {
    browser
      .url(`${variables.url}/users`)
      .assert.elementPresent('#searchTerms')
      .waitForElementVisible('div[class="collection_list"] ul:first-of-type span.title > a')
      .click('#searchTerms')
      .setValue('#searchTerms', 'Ayomide')
      .click('#searchBtn')
      .pause(1000)
      .assert.containsText('div[class="collection_list"] ul:first-of-type span.title > a', 'Ayomide Ayobami')
      .end();
  },
  'Delete user': (browser) => {
    browser
      .url(`${variables.url}/users`)
      .waitForElementVisible('body', 1000)
      .click('div[class="collection_list"] ul:first-of-type i.delete-btn')
      .pause(500)
      .waitForElementVisible('button.confirm')
      .click('button.confirm')
      .pause(500)
      .expect.element('div[class="collection_list"] ul:first-of-type span.title > a').text.to.not.equal('Good Abigail');
  },
  after: browser => browser.end()
};
