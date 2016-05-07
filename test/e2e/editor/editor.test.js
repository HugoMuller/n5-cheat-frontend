'use strict';

const elements = require('../utils/editor-elements.js');
const errors = require('../utils/error-list.js');

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
  errors.expect.toBeKoWith([
    'Information Errors',
    'Cheats Errors'
  ], [
    'Invalid game title',
    'Invalid version CRC',
    'Invalid version title'
  ]);

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

  expect(inputGameTitle.getAttribute('value')).toBe('');
  expect(xmlGameTitle.getText()).toBe('""');
  errors.expect.toBeKoWith('Information Errors', 'Invalid game title');

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
    errors.expect.toBeKo();
    errors.expect.not.toContain('Invalid game title');
  }
}

///////////////////////////////////////////////////////////////////////////

function setVersionCrc(){
  browser.get('#/editor');

  const inputVersionCrc = elements.getInputVersionCrc();
  const xmlVersionCrc = elements.getXmlVersionCrc();
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


  expect(inputVersionCrc.getAttribute('value')).toBe('');
  expect(xmlVersionCrc.getText()).toBe('""');
  errors.expect.toBeKoWith('Information Errors', 'Invalid version CRC');
  validCrc.forEach(shouldBeOk);
  wrongCrc.forEach(shouldBeKo);

  //////////////////////////////////

  function shouldBeOk(crc){
    const actual = crc.substr(0, 8);
    const expected = actual.toUpperCase();

    inputVersionCrc.clear().sendKeys(crc);

    expect(inputVersionCrc.getAttribute('value')).toBe(actual);
    expect(xmlVersionCrc.getText()).toBe(`"${expected}"`);
    errors.expect.toBeKo();
    errors.expect.not.toContain('Invalid version CRC');
  }

  function shouldBeKo(crc){
    inputVersionCrc.clear().sendKeys(crc);

    expect(inputVersionCrc.getAttribute('value')).toBe(crc.substr(0, 8));
    expect(xmlVersionCrc.getText()).toBe('""');
    errors.expect.toBeKoWith('Information Errors', 'Invalid version CRC');
  }
}

///////////////////////////////////////////////////////////////////////////

function setVersionTitle(){
  browser.get('#/editor');

  const inputVersionTitle = elements.getInputVersionTitle();
  const xmlVersionTitle = elements.getXmlVersionTitle();

  expect(inputVersionTitle.getAttribute('value')).toBe('');
  expect(xmlVersionTitle.getText()).toBe('""');
  errors.expect.toBeKoWith('Information Errors', 'Invalid version title');

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
    errors.expect.toBeKo();
    errors.expect.not.toContain('Invalid version title');
  }
}
