'use strict';

const elements = require('../utils/editor-elements.js');
const expectation = require('../utils/expectation.js');

const xmlExpectedErrors = [
  'No game title',
  'No valid version CRC',
  'No version title',
  'No valid cheat codes'
];
const sampleCode = `abcdefghijklmnopqrstuvwxyz
ABCDEFGHIJKLMNOPQRSTUVWXYZ
012345679:0123 456 789:0,1&~#!`;
const sampleCodeExpected = 'ABCDEFAB,CDEF0123,45679012,34567890';

module.exports = {
  completeXml
};

function completeXml(){
  browser.get('#/editor');

  gameInfoShouldBe('', '', '');
  cheatStatusShouldBe(0, '"0"', false);
  expect(elements.getXmlInfoErrorList().getText()).toEqual(xmlExpectedErrors);

  elements.getInputGameTitle().clear().sendKeys('Some Game');
  elements.getInputVersionCrc().clear().sendKeys('0123ABCD');
  elements.getInputVersionTitle().clear().sendKeys('Some info');
  elements.getMoreCheatsButton().click();

  const cheat = elements.getCheatElementWrapper(0);
  const xmlCheat = elements.getXmlCheatWrapper(0);

  cheat
    .name('some cheat')
    .hacker('someone')
    .format('GameShark')
    .code(sampleCode);

  gameInfoShouldBe('Some Game', '0123ABCD', 'Some info');
  cheatStatusShouldBe(1, '"1"', true);
  expect(elements.getXmlInfoSuccessContainer().getText()).toBe('XML is well formed');
  expectation.expectCheat(cheat).toHave('some cheat', 'someone', 'GameShark', sampleCode);
  expectation.expectCheat(xmlCheat).toHave('"some cheat"', '"someone"', '"GameShark"', sampleCodeExpected);

  //////////////////////////////////

  function gameInfoShouldBe(title, crc, versionTitle){
    title = title.substr(0, 50);
    crc = crc.substr(0, 8);
    versionTitle = versionTitle.substr(0, 50);

    expect(elements.getInputGameTitle().getAttribute('value')).toBe(title);
    expect(elements.getXmlGameTitle().getText()).toBe(`"${title}"`);

    expect(elements.getInputVersionCrc().getAttribute('value')).toBe(crc);
    expect(elements.getXmlVersionCrc().getText()).toBe(`"${crc.toUpperCase()}"`);

    expect(elements.getInputVersionTitle().getAttribute('value')).toBe(versionTitle);
    expect(elements.getXmlVersionTitle().getText()).toBe(`"${versionTitle}"`);
  }

  function cheatStatusShouldBe(cheatCount, xmlCheatCount, xmlInfoSuccessVisible){
    expect(elements.getCheatElementList().count()).toBe(cheatCount);
    expect(elements.getXmlCheatCount().getText()).toBe(xmlCheatCount);
    expect(elements.getXmlInfoSuccessContainer().isPresent()).toBe(xmlInfoSuccessVisible);
    expect(elements.getXmlInfoErrorContainer().isPresent()).toBe(!xmlInfoSuccessVisible);
  }
}
