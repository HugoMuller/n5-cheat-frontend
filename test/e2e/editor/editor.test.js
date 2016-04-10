'use strict';

const elements = require('../utils/editor-elements.js');

module.exports = {
  init,
  setGameTitle,
  setVersionCrc,
  setVersionTitle
};

function init(){
  browser.get('#/editor');

  expect(browser.getTitle()).toBe('RetroN5 cheats manager');

  [
    'getEditorLeft',
    'getInputGameTitle',
    'getInputVersionCrc',
    'getInputVersionTitle',
    'getCheatsContainer',
    'getMoreCheatsButton',
    'getEditorRight',
    'getXmlInfoErrorContainer',
    'getXmlCompiledContainer',
    'getXmlGameTitle',
    'getXmlVersionCrc',
    'getXmlCheatCount',
    'getXmlVersionTitle'
  ].forEach(shouldBePresent);

  [
    'getInputGameTitle',
    'getInputVersionCrc',
    'getInputVersionTitle'
  ].forEach(shouldBeEmpty);

  expect(elements.getCheatElementList().count()).toBe(0);

  [ 'getXmlGameTitle',
    'getXmlVersionCrc',
    'getXmlVersionTitle'
  ].forEach(shouldBeEmptyString);

  expect(elements.getXmlCheatCount().getText()).toBe('"0"');
  expect(elements.getXmlInfoSuccessContainer().isPresent()).toBe(false);

  const xmlErrorList = elements.getXmlInfoErrorList();
  const xmlExpectedErrors = [
    'No game title',
    'No valid version CRC',
    'No version title',
    'No valid cheat codes'
  ];

  expect(xmlErrorList.count()).toBe(4);
  expect(xmlErrorList.getText()).toEqual(xmlExpectedErrors);
  expect(elements.getXmlCheatLines().count()).toBe(0);

  //////////////////////////////////

  function shouldBePresent(element){
    expect(elements[element]().isPresent()).toBe(true);
  }

  function shouldBeEmpty(element){
    expect(elements[element]().getAttribute('value')).toBe('');
  }

  function shouldBeEmptyString(element){
    expect(elements[element]().getText()).toBe('""');
  }
}

///////////////////////////////////////////////////////////////////////////

function setGameTitle(){
  browser.get('#/editor');

  const inputGameTitle = elements.getInputGameTitle();
  const xmlGameTitle = elements.getXmlGameTitle();
  const xmlErrorList = elements.getXmlInfoErrorList();
  const expectValuesToBe = checkValuesOf(inputGameTitle, xmlGameTitle, xmlErrorList);

  expectValuesToBe('', '""', 'No game title');

  [
    'short title',
    'very very very loooooong title, too much long, longer title ever written'
  ].forEach(testTitle);

  //////////////////////////////////

  function testTitle(title){
    const expected = title.substr(0, 50);

    inputGameTitle.clear().sendKeys(title);
    expectValuesToBe(expected, `"${expected}"`, { not: 'No game title' });
  }
}

///////////////////////////////////////////////////////////////////////////

function setVersionCrc(){
  browser.get('#/editor');

  const inputVersionCrc = elements.getInputVersionCrc();
  const xmlVersionCrc = elements.getXmlVersionCrc();
  const xmlErrorList = elements.getXmlInfoErrorList();
  const expectValuesToBe = checkValuesOf(inputVersionCrc, xmlVersionCrc, xmlErrorList);
  const validCrc = [
    '01234567',
    '0123AbcD',
    'AbCdEf78',
    '0123456789',
  ];
  const wrongCrc = [
    '1',
    'azerty78',
    'QWERTY01',
    'abcdefghijk'
  ];

  expectValuesToBe('', '""', 'No valid version CRC');
  validCrc.forEach(shouldBeOk);
  wrongCrc.forEach(shouldBeKo);

  //////////////////////////////////

  function shouldBeOk(crc){
    const actual = crc.substr(0, 8);
    const expected = actual.toUpperCase();

    inputVersionCrc.clear().sendKeys(crc);
    expectValuesToBe(actual, `"${expected}"`, { not: 'No valid version CRC' });
  }

  function shouldBeKo(crc){
    inputVersionCrc.clear().sendKeys(crc);
    expectValuesToBe(crc.substr(0, 8), '""', 'No valid version CRC');
  }
}

///////////////////////////////////////////////////////////////////////////

function setVersionTitle(){
  browser.get('#/editor');

  const inputVersionTitle = elements.getInputVersionTitle();
  const xmlVersionTitle = elements.getXmlVersionTitle();
  const xmlErrorList = elements.getXmlInfoErrorList();
  const expectValuesToBe = checkValuesOf(inputVersionTitle, xmlVersionTitle, xmlErrorList);

  expectValuesToBe('', '""', 'No version title');

  [
    'short title',
    'very very very loooooong title, too much long, longer title ever written'
  ].forEach(testTitle);

  //////////////////////////////////

  function testTitle(title){
    const expected = title.substr(0, 50);

    inputVersionTitle.clear().sendKeys(title);
    expectValuesToBe(expected, `"${expected}"`, { not: 'No version title' });
  }
}

///////////////////////////////////////////////////////////////////////////

function checkValuesOf(inputField, xmlField, xmlErrorList){
  return (expectedInput, expectedXmlValue, expectedXmlError) => {
    let expectXmlErrorList = expect(xmlErrorList.getText());
    let expectedError = expectedXmlError;
    if(expectedXmlError.hasOwnProperty('not')){
      expectXmlErrorList = expectXmlErrorList.not;
      expectedError = expectedError.not;
    }

    expect(inputField.getAttribute('value')).toBe(expectedInput);
    expect(xmlField.getText()).toBe(expectedXmlValue);
    expectXmlErrorList.toContain(expectedError);
  };
}
