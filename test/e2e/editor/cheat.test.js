'use strict';

const elements = require('../utils/editor-elements.js');
const expectation = require('../utils/expectation.js');

const consoleDdl = elements.getDdlConsole();
const cheatElementList = elements.getCheatElementList();
const moreCheatButton = elements.getMoreCheatsButton();
const xmlCheatCount = elements.getXmlCheatCount();
const xmlErrorList = elements.getXmlInfoErrorList();

const sampleCode = `abcdefghijklmnopqrstuvwxyz
ABCDEFGHIJKLMNOPQRSTUVWXYZ
012345679:0123 456 789:0,1&~#!`;
const sampleCodeExpected = {
  GameShark: 'ABCDEFAB,CDEF0123,45679012,34567890',
  'Game Genie': 'ABCD:EF,ABCD:EF,0123:45,6790:12,3456:78',
  Raw: 'ABCD:EF,ABCD:EF,0123:45,6790:12,3456:78'
};

module.exports = {
  addCheats,
  addOneCheat,
  removeCheats,
  removeOneCheat,
  consoleChanges
};

///////////////////////////////////////////////////////////////////////////

function addOneCheat(){
  browser.get('#/editor');

  const expectValuesToBe = checkValuesOf(cheatElementList, xmlCheatCount, xmlErrorList);
  const cheat = elements.getCheatElementWrapper(0);

  expectValuesToBe(0, '"0"', 'No valid cheat codes');
  expect(elements.getXmlCheatLines().count()).toBe(0);
  moreCheatButton.click();
  expectValuesToBe(1, '"0"', 'No valid cheat codes');
  expect(elements.getXmlCheatLines().count()).toBe(0);
  expect(elements.getCheatElementLegend(0).getText()).toBe('Cheat #1 remove');
  expectation.expectCheat(cheat).toHave('', '', 'GameShark', '');
  expect(cheat.placeHolder()).not.toBe('');

  testName();
  testHacker();
  testCode();
  testFormat();
  testAll();

  //////////////////////////////////

  function testName(){
    [
      'short name',
      'very very very loooooong name, too much long, longer name ever written',
      ''
    ].forEach(testValueOf('name'));
  }

  function testHacker(){
    [
      'short hacker name',
      'very very very loooooong hacker name, too much long, longer hacker name ever written',
      ''
    ].forEach(testValueOf('hacker'));
  }

  function testFormat(){
    [
      'GameShark',
      'Game Genie',
      'GameShark'
    ].forEach(testValueOf('format'));
  }

  function testCode(){
    [
      sampleCode,
      ''
    ].forEach(testValueOf('code'));
  }

  function testAll(){
    cheat
      .name('some cheat')
      .format('GameShark')
      .code(sampleCode);

    expectation.expectCheat(cheat).toHave('some cheat', '', 'GameShark', sampleCode);
    expectValuesToBe(1, '"1"', { not: 'No valid cheat codes' });
    expect(elements.getXmlCheatLines().count()).toBe(1);

    const xmlCheat = elements.getXmlCheatWrapper(0);
    expectation.expectCheat(xmlCheat).toHave('"some cheat"', '"Unknown"', '"GameShark"', sampleCodeExpected.GameShark);

    cheat.hacker('someone');
    expectation.expectCheat(cheat).toHave('some cheat', 'someone', 'GameShark', sampleCode);
    expectValuesToBe(1, '"1"', { not: 'No valid cheat codes' });
    expect(elements.getXmlCheatLines().count()).toBe(1);
    expectation.expectCheat(xmlCheat).toHave('"some cheat"', '"someone"', '"GameShark"', sampleCodeExpected.GameShark);

    cheat.format('Game Genie');
    expectation.expectCheat(cheat).toHave('some cheat', 'someone', 'Game Genie', sampleCode);
    expectation.expectCheat(xmlCheat).toHave('"some cheat"', '"someone"', '"Game Genie"', sampleCodeExpected['Game Genie']);
  }
  //////////////////////////////////

  function testValueOf(property){
    return (value) => {
      let expected = value;
      if(['name', 'hacker'].indexOf(property) !== -1){
        expected = value.substr(0, 50);
      }

      cheat[property](value);
      expect(cheat[property]()).toBe(expected);
      expectValuesToBe(1, '"0"', 'No valid cheat codes');
      expect(elements.getXmlCheatLines().count()).toBe(0);
    };
  }
}

///////////////////////////////////////////////////////////////////////////

function removeOneCheat(){
  browser.get('#/editor');

  const expectValuesToBe = checkValuesOf(cheatElementList, xmlCheatCount, xmlErrorList);
  const cheat = elements.getCheatElementWrapper(0);

  expectValuesToBe(0, '"0"', 'No valid cheat codes');
  moreCheatButton.click();
  expectValuesToBe(1, '"0"', 'No valid cheat codes');
  expect(elements.getXmlCheatLines().count()).toBe(0);

  expect(elements.getCheatElementLegend(0).getText()).toBe('Cheat #1 remove');

  cheat
    .name('some cheat')
    .hacker('someone')
    .format('GameShark')
    .code(sampleCode);

  expectValuesToBe(1, '"1"', { not: 'No valid cheat codes' });
  expect(elements.getXmlCheatLines().count()).toBe(1);

  const xmlCheat = elements.getXmlCheatWrapper(0);
  expectation.expectCheat(xmlCheat).toHave('"some cheat"', '"someone"', '"GameShark"', sampleCodeExpected.GameShark);

  elements.getCheatRemoveButton(0).click();
  expectValuesToBe(0, '"0"', 'No valid cheat codes');
  expect(elements.getXmlCheatLines().count()).toBe(0);
}

///////////////////////////////////////////////////////////////////////////

function addCheats(){
  browser.get('#/editor');

  const expectValuesToBe = checkValuesOf(cheatElementList, xmlCheatCount, xmlErrorList);
  const cheats = [
    elements.getCheatElementWrapper(0),
    elements.getCheatElementWrapper(1)
  ];
  const xmlCheats = [
    elements.getXmlCheatWrapper(0),
    elements.getXmlCheatWrapper(1)
  ];

  expectValuesToBe(0, '"0"', 'No valid cheat codes');
  expect(elements.getXmlCheatLines().count()).toBe(0);

  for(let j=0; j<cheats.length; j++){
    moreCheatButton.click();
  }

  expectValuesToBe(cheats.length, '"0"', 'No valid cheat codes');
  expect(elements.getXmlCheatLines().count()).toBe(0);

  cheats.forEach((cheat, i) => {
    expect(elements.getCheatElementLegend(i).getText()).toBe(`Cheat #${i+1} remove`);
    expectation.expectCheat(cheat).toHave('', '', 'GameShark', '');
  });

  cheats[0]
    .name('some cheat')
    .hacker('someone')
    .format('GameShark')
    .code('1234567812345678');

  expect(elements.getXmlCheatLines().count()).toBe(1);

  cheats[1]
    .name('another cheat')
    .hacker('another guy')
    .format('Game Genie')
    .code('ABCDEF');

  expect(elements.getXmlCheatLines().count()).toBe(cheats.length);
  expectValuesToBe(cheats.length, `"${cheats.length}"`, { not: 'No valid cheat codes' });

  expectation.expectCheat(cheats[0]).toHave('some cheat', 'someone', 'GameShark', '1234567812345678');
  expectation.expectCheat(cheats[1]).toHave('another cheat', 'another guy', 'Game Genie', 'ABCDEF');

  expectation.expectCheat(xmlCheats[0]).toHave('"some cheat"', '"someone"', '"GameShark"', '12345678,12345678');
  expectation.expectCheat(xmlCheats[1]).toHave('"another cheat"', '"another guy"', '"Game Genie"', 'ABCD:EF');
}

///////////////////////////////////////////////////////////////////////////

function removeCheats(){
  browser.get('#/editor');

  const expectValuesToBe = checkValuesOf(cheatElementList, xmlCheatCount, xmlErrorList);
  const cheat = elements.getCheatElementWrapper;
  const xmlCheat = elements.getXmlCheatWrapper;
  let cheatCount = 3;

  expectValuesToBe(0, '"0"', 'No valid cheat codes');
  expect(elements.getXmlCheatLines().count()).toBe(0);

  for(let j=0; j<cheatCount; j++){
    moreCheatButton.click();
  }

  expectValuesToBe(cheatCount, '"0"', 'No valid cheat codes');
  expect(elements.getXmlCheatLines().count()).toBe(0);

  cheat(0)
    .name('some cheat')
    .hacker('someone')
    .format('GameShark')
    .code('1234567812345678');

  cheat(1)
    .name('another cheat')
    .hacker('another guy')
    .format('Game Genie')
    .code('ABCDEF');

  cheat(2)
    .name('third cheat')
    .hacker('third guy')
    .format('GameShark')
    .code('01CDEF01');

  expect(elements.getXmlCheatLines().count()).toBe(cheatCount);
  expectValuesToBe(cheatCount, `"${cheatCount}"`, { not: 'No valid cheat codes' });

  deleteCheat(1);
  checkCheat(
    0,
    ['some cheat', 'someone', 'GameShark', '1234567812345678'],
    ['"some cheat"', '"someone"', '"GameShark"', '12345678,12345678']
  );
  checkCheat(
    1,
    ['third cheat', 'third guy', 'GameShark', '01CDEF01'],
    ['"third cheat"', '"third guy"', '"GameShark"', '01CDEF01']
  );

  deleteCheat(0);
  checkCheat(
    0,
    ['third cheat', 'third guy', 'GameShark', '01CDEF01'],
    ['"third cheat"', '"third guy"', '"GameShark"', '01CDEF01']
  );

  deleteCheat(0);

  //////////////////////////////////

  function deleteCheat(id){
    elements.getCheatRemoveButton(id).click();
    cheatCount--;
    expect(elements.getXmlCheatLines().count()).toBe(cheatCount);

    let expectedError = 'No valid cheat codes';
    if(cheatCount > 0){
      expectedError = { not: expectedError };
    }
    expectValuesToBe(cheatCount, `"${cheatCount}"`, expectedError);
  }

  function checkCheat(id, cheatProperties, xmlCheatValues){
    expectation.expectCheat(cheat(id)).toHave.apply(null, cheatProperties);
    expect(elements.getCheatElementLegend(id).getText()).toBe(`Cheat #${id+1} remove`);
    expectation.expectCheat(xmlCheat(id)).toHave.apply(null, xmlCheatValues);
  }
}

///////////////////////////////////////////////////////////////////////////

function consoleChanges(){
  browser.get('#/editor');

  const expectValuesToBe = checkValuesOf(cheatElementList, xmlCheatCount, xmlErrorList);
  const cheat = elements.getCheatElementWrapper(0);

  expect(elements.getXmlCheatLines().count()).toBe(0);
  moreCheatButton.click();
  expect(elements.getXmlCheatLines().count()).toBe(0);
  expect(elements.getCheatElementLegend(0).getText()).toBe('Cheat #1 remove');
  expectation.expectCheat(cheat).toHave('', '', 'GameShark', '');

  const oldPlaceHolder = cheat.placeHolder();
  expect(oldPlaceHolder).not.toBe('');

  cheat
    .name('some cheat')
    .hacker('someone')
    .format('GameShark')
    .code(sampleCode);

  expectation.expectCheat(cheat).toHave('some cheat', 'someone', 'GameShark', sampleCode);
  expectValuesToBe(1, '"1"', { not: 'No valid cheat codes' });
  expect(elements.getXmlCheatLines().count()).toBe(1);

  const xmlCheat = elements.getXmlCheatWrapper(0);
  expectation.expectCheat(xmlCheat).toHave('"some cheat"', '"someone"', '"GameShark"', sampleCodeExpected.GameShark);

  consoleDdl('NES');

  expectation.expectCheat(cheat).toHave('some cheat', 'someone', 'Raw', sampleCode);
  expectation.expectCheat(xmlCheat).toHave('"some cheat"', '"someone"', '"Raw"', sampleCodeExpected.Raw);

  cheat.code('');

  expect(cheat.placeHolder()).not.toBe('');
  expect(cheat.placeHolder()).not.toBe(oldPlaceHolder);
}

///////////////////////////////////////////////////////////////////////////

function checkValuesOf(cheatCount, _xmlCheatCount, _xmlErrorList){
  return (expectedCheatCount, expectedXmlcheatCount, expectedXmlError) => {
    let expectXmlErrorList = expect(_xmlErrorList.getText());
    let expectedError = expectedXmlError;
    if(expectedXmlError.hasOwnProperty('not')){
      expectXmlErrorList = expectXmlErrorList.not;
      expectedError = expectedError.not;
    }

    expect(cheatCount.count()).toBe(expectedCheatCount);
    expect(_xmlCheatCount.getText()).toBe(expectedXmlcheatCount);
    expectXmlErrorList.toContain(expectedError);
  };
}
