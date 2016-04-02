'use strict';

module.exports = {
  rootTest,
  redirectTest
};

function rootTest(){
  browser.get('/');

  expect(browser.getLocationAbsUrl()).toBe('/');
}

function redirectTest(){
  browser.get('/#anywhere');

  expect(browser.getLocationAbsUrl()).toBe('/');
}
