'use strict';

const elements = require('../utils/editor-elements.js');

module.exports = {
  initTest,
  setGameTitle,
  setVersionCrc,
  setVersionTitle
};

function initTest(){
  browser.get('/');

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
  browser.get('/');

  const inputGameTitle = elements.getInputGameTitle();
  const xmlGameTitle = elements.getXmlGameTitle();
  const xmlErrors = elements.getXmlInfoErrorList();

  expect(inputGameTitle.getAttribute('value')).toBe('');
  expect(xmlGameTitle.getText()).toBe('""');
  expect(xmlErrors.getText()).toContain('No game title');

  [
    'short title',
    'very very very loooooong title, too much long, longer title ever written'
  ].forEach(testTitle);

  //////////////////////////////////

  function testTitle(title){
    const expected = title.substr(0, 50);

    inputGameTitle.clear().sendKeys(title);

    expect(inputGameTitle.getAttribute('value')).toBe(expected);
    expect(xmlGameTitle.getText()).toBe(`"${expected}"`);
    expect(xmlErrors.getText()).not.toContain('No game title');
  }
}

function setVersionCrc(){
  browser.get('/');

  const inputVersionCrc = elements.getInputVersionCrc();
  const xmlVersionCrc = elements.getXmlVersionCrc();
  const xmlErrors = elements.getXmlInfoErrorList();

  expect(inputVersionCrc.getAttribute('value')).toBe('');
  expect(xmlVersionCrc.getText()).toBe('""');
  expect(xmlErrors.getText()).toContain('No valid version CRC');

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

  validCrc.forEach(shouldBeOk);
  wrongCrc.forEach(shouldBeKo);

  //////////////////////////////////

  function shouldBeOk(crc){
    const actual = crc.substr(0, 8);
    const expected = actual.toUpperCase();

    inputVersionCrc.clear().sendKeys(crc);

    expect(inputVersionCrc.getAttribute('value')).toBe(actual);
    expect(xmlVersionCrc.getText()).toBe(`"${expected}"`);
    expect(xmlErrors.getText()).not.toContain('No valid version CRC');
  }

  function shouldBeKo(crc){
    inputVersionCrc.clear().sendKeys(crc);

    expect(inputVersionCrc.getAttribute('value')).toBe(crc.substr(0, 8));
    expect(xmlVersionCrc.getText()).toBe('""');
    expect(xmlErrors.getText()).toContain('No valid version CRC');
  }
}

function setVersionTitle(){
  browser.get('/');

  const inputVersionTitle = elements.getInputVersionTitle();
  const xmlVersionTitle = elements.getXmlVersionTitle();
  const xmlErrors = elements.getXmlInfoErrorList();

  expect(inputVersionTitle.getAttribute('value')).toBe('');
  expect(xmlVersionTitle.getText()).toBe('""');
  expect(xmlErrors.getText()).toContain('No version title');

  [
    'short title',
    'very very very loooooong title, too much long, longer title ever written'
  ].forEach(testTitle);

  //////////////////////////////////

  function testTitle(title){
    const expected = title.substr(0, 50);

    inputVersionTitle.clear().sendKeys(title);

    expect(inputVersionTitle.getAttribute('value')).toBe(expected);
    expect(xmlVersionTitle.getText()).toBe(`"${expected}"`);
    expect(xmlErrors.getText()).not.toContain('No version title');
  }
}
