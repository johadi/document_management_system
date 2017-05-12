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
      .waitForElementVisible('.create-document', 3000);
  },
  'Create Document': (browser) => {
    browser
      .click('.create-document')
      .pause(2000)
      .waitForElementVisible('body')
      .assert.containsText('h4', 'Create A Document')
      .waitForElementVisible('body')
      .assert.elementPresent('#access')
      .pause(500)
      .setValue('input#title', faker.lorem.word())
      .execute('FroalaEditor.setContent("cool title content")')
      .click('#access option[value="public"]')
      .pause(500)
      .click('button[type="submit"]')
      .pause(2000)
      .assert.urlEquals(`${variables.url}/document`)
      .end();
  },
  'Search document': (browser) => {
    browser
      .assert.elementPresent('#searchTerms')
      .waitForElementVisible('div[class="collection_list"] ul:first-of-type span.title > a')
      .click('#searchTerms')
      .setValue('#searchTerms', 'Expanded')
      .click('#searchBtn')
      .pause(1000)
      .assert.containsText('div[class="collection_list"] ul:first-of-type span.title > a', 'Expanded global info-mediaries')
      .pause(2000)
      .end();
  },
  after: browser => browser.end()
};
