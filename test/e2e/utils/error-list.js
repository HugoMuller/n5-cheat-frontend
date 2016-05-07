'use strict';

const elements = require('./editor-elements.js');
const expectation = require('../utils/expectation.js');

module.exports = {
  expect: {
    toBeOk,
    toBeKo,
    toBeKoWith,
    toBeKoWithout,
    toContain: toContain(true),
    toContainHeaders: toContainHeaders(true),
    not: {
      toContain: toContain(false),
      toContainHeaders: toContainHeaders(false)
    }
  }
};

function toBeOk(){
  const button = elements.getXmlInfoErrorButton();
  expect(button.getText()).toContain('OK');
}

function toBeKo(){
  const button = elements.getXmlInfoErrorButton();
  expect(button.getText()).toContain('errors');
}

function toBeKoWith(headers, errors){
  toBeKoWithOrWithout(true, headers, errors);
}

function toBeKoWithout(headers, errors){
  toBeKoWithOrWithout(false, headers, errors);
}

function toBeKoWithOrWithout(_with, headers, errors){
  toBeKo();
  elements.getXmlInfoErrorButton().click();
  toContainHeaders(!!_with)(headers);

  if(errors){
    toContain(!!_with)(errors);
  }
}

function toContain(to){
  const _expectation = to ? expectation : expectation.not;

  return (errors) => {
    elements
      .getXmlInfoErrorListContainer()
      .isDisplayed()
      .then((isDisplayed) => {
        if(!isDisplayed) elements.getXmlInfoErrorButton().click();

        elements
          .getXmlInfoErrorList()
          .getText()
          .then((text) => _expectation.toContainSeveral(text, errors));
      });
  };
}

function toContainHeaders(to){
  const _expectation = to ? expectation : expectation.not;

  return (headers) => {
    elements
      .getXmlInfoErrorListContainer()
      .isDisplayed()
      .then((isDisplayed) => {
        if(!isDisplayed) elements.getXmlInfoErrorButton().click();

        elements
          .getXmlInfoErrorHeaders()
          .getText()
          .then((text) => _expectation.toContainSeveral(text, headers));
      });
  };
}
