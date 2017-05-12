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
      .setValue('input#title', `title of-${faker.lorem.word()}`)
      .click('.fr-view')
      .execute(() => {
        document.getElementsByClassName('fr-view')[0].onclick = () => {
          document.getElementsByClassName('fr-view')[0].getElementsByTagName('p')[0].innerHTML = 'cool title content';
        };
      }, [])
      .click('.fr-view')
      .click('#access option[value="public"]')
      .pause(500)
      .click('button[type="submit"]')
      .pause(5000)
      .assert.urlEquals(`${variables.url}/dashboard`)
      .waitForElementVisible('body')
      .end();
  },
  'Edit document': (browser) => {
    browser
      .url(`${variables.url}/document/1/edit`)
      .clearValue('input#title')
      .setValue('input#title', `title of ${faker.lorem.word()}`)
      .click('#access option[value="public"]')
      .pause(500)
      .click('button[type="submit"]')
      .pause(1500)
      .assert.urlEquals(`${variables.url}/dashboard`)
      .waitForElementVisible('body')
      .end();
  },
  'View document': (browser) => {
    browser
      .url(`${variables.url}/document/1`)
      .pause(2000)
      .assert.urlEquals(`${variables.url}/document/1`)
      .waitForElementVisible('div[class="card-action"]')
      .assert.containsText('div[class="card-action"]', 'public')
      .end();
  },
  'View documents': (browser) => {
    browser
      .url(`${variables.url}/dashboard`)
      .pause(2000)
      .assert.urlEquals(`${variables.url}/dashboard`)
      .waitForElementVisible('div[class="collection_list"]')
      .assert.containsText('h4', 'Documents')
      .waitForElementVisible('div[class="collection_list"] ul:first-of-type span.title')
      .assert.containsText('div[class="collection_list"] ul:first-of-type div.doc-access', 'public')
      .end();
  },
  'Search document': (browser) => {
    browser
      .url(`${variables.url}/dashboard`)
      .pause(1000)
      .assert.elementPresent('#searchTerms')
      .waitForElementVisible('div[class="collection_list"] ul:first-of-type span.title > a')
      .click('#searchTerms')
      .setValue('#searchTerms', 'title')
      .click('#searchBtn')
      .pause(1000)
      .assert.containsText('div[class="collection_list"] ul:first-of-type div.doc-access', 'public')
      .pause(2000);
  },
  'Delete Document': (browser) => {
    browser
      .click('div[class="collection_list"] ul:first-of-type i.delete-btn')
      .pause(500)
      .waitForElementVisible('button.confirm')
      .click('button.confirm');
  },
  after: browser => browser.end()
};
