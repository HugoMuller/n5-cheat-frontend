'use strict';

const elements = require('../utils/editor-elements.js');
const expectation = require('../utils/expectation.js');
const errors = require('../utils/error-list.js');

const consoleDdl = elements.getDdlConsole();
const cheatElementList = elements.getCheatElementList();
const moreCheatButton = elements.getMoreCheatsButton();
const xmlCheatCount = elements.getXmlCheatCount();

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
  const cheat = elements.getCheatElementWrapper(0);

  expect(cheatElementList.count()).toBe(0);
  expect(xmlCheatCount.getText()).toBe('"0"');
  errors.expect.toBeKoWith('Cheats Errors', 'No cheat code');
  expect(elements.getXmlCheatLines().count()).toBe(0);

  moreCheatButton.click();

  expect(cheatElementList.count()).toBe(1);
  expect(xmlCheatCount.getText()).toBe('"0"');
  errors.expect.toBeKoWith('Cheats Errors', 'Cheat #1 has no name');
  expect(elements.getXmlCheatLines().count()).toBe(1);
  expect(elements.getCheatElementLegend(0).getText()).toBe('Cheat #1 remove');
  expectation.expectCheat(cheat).toHave('', '', 'GameShark', '');
  expect(cheat.placeHolder()).not.toBe('');

  testFormat();
  testName();
  testHacker();
  testCode();
  testAll();

  //////////////////////////////////

  function testFormat(){
    resetCheat(cheat);
    doTest('GameShark');
    doTest('Game Genie');

    function doTest(format){
      cheat.format(format);

      expect(cheat.format()).toBe(format);
      expect(cheatElementList.count()).toBe(1);
      expect(xmlCheatCount.getText()).toBe('"0"');
      expect(elements.getXmlCheatLines().count()).toBe(1);

      if(!format){
        errors.expect.toContain('Cheat #1 has no format');
      }else{
        errors.expect.not.toContain('Cheat #1 has no format');
      }
    }
  }

  function testName(){
    resetCheat(cheat);
    doTest('');
    doTest('short name');
    doTest('very very very loooooong name, too much long, longer name ever written');

    function doTest(name){
      cheat
        .format('GameShark')
        .name(name);

      expect(cheat.name()).toBe(name.substr(0, 50));
      expect(cheatElementList.count()).toBe(1);
      expect(xmlCheatCount.getText()).toBe('"0"');
      expect(elements.getXmlCheatLines().count()).toBe(1);
      errors.expect.toBeKo();

      if(!name){
        errors.expect.toContain('Cheat #1 has no name');
      }else{
        errors.expect.not.toContain('Cheat #1 has no name');
      }
    }
  }

  function testHacker(){
    resetCheat(cheat);
    doTest('');
    doTest('short hacker name');
    doTest('very very very loooooong hacker name, too much long, longer hacker name ever written');

    function doTest(hacker){
      cheat
        .format('GameShark')
        .name('name')
        .hacker(hacker);

      expect(cheat.hacker()).toBe(hacker.substr(0, 50));
      expect(cheatElementList.count()).toBe(1);
      expect(xmlCheatCount.getText()).toBe('"0"');
      expect(elements.getXmlCheatLines().count()).toBe(1);
    }
  }

  function testCode(){
    resetCheat(cheat);
    doTest('');
    doTest(sampleCode);

    function doTest(code){
      let expectedCount = 0;
      cheat
        .format('GameShark')
        .name('some name')
        .code(code);

      expect(cheat.code()).toBe(code);
      expect(cheatElementList.count()).toBe(1);

      if(!code){
        errors.expect.toBeKoWith('Cheats Errors', 'Cheat #1 has invalid code');
      }else{
        expectedCount = 1;
        errors.expect.toBeKoWithout('Cheats Errors');
      }

      expect(xmlCheatCount.getText()).toBe(`"${expectedCount}"`);
      expect(elements.getXmlCheatLines().count()).toBe(1);
    }
  }

  function testAll(){
    resetCheat(cheat);
    cheat
      .name('some cheat')
      .format('GameShark')
      .code(sampleCode);

    expectation.expectCheat(cheat).toHave('some cheat', '', 'GameShark', sampleCode);
    expect(cheatElementList.count()).toBe(1);
    expect(xmlCheatCount.getText()).toBe('"1"');
    errors.expect.toBeKoWithout('Cheats Errors');
    expect(elements.getXmlCheatLines().count()).toBe(1);

    const xmlCheat = elements.getXmlCheatWrapper(0);
    expectation.expectCheat(xmlCheat).toHave('"some cheat"', '"Unknown"', '"GameShark"', sampleCodeExpected.GameShark);

    cheat.hacker('someone');
    expectation.expectCheat(cheat).toHave('some cheat', 'someone', 'GameShark', sampleCode);
    expect(cheatElementList.count()).toBe(1);
    expect(xmlCheatCount.getText()).toBe('"1"');
    errors.expect.toBeKoWithout('Cheats Errors');

    expect(elements.getXmlCheatLines().count()).toBe(1);
    expectation.expectCheat(xmlCheat).toHave('"some cheat"', '"someone"', '"GameShark"', sampleCodeExpected.GameShark);

    cheat.format('Game Genie');
    expectation.expectCheat(cheat).toHave('some cheat', 'someone', 'Game Genie', sampleCode);
    expectation.expectCheat(xmlCheat).toHave('"some cheat"', '"someone"', '"Game Genie"', sampleCodeExpected['Game Genie']);
  }
}

///////////////////////////////////////////////////////////////////////////

function removeOneCheat(){
  browser.get('#/editor');

  const cheat = elements.getCheatElementWrapper(0);

  expect(cheatElementList.count()).toBe(0);
  expect(xmlCheatCount.getText()).toBe('"0"');
  errors.expect.toBeKoWith('Cheats Errors', 'No cheat code');

  moreCheatButton.click();
  expect(cheatElementList.count()).toBe(1);
  expect(xmlCheatCount.getText()).toBe('"0"');
  errors.expect.toBeKoWith('Cheats Errors', 'Cheat #1 has no name');
  expect(elements.getXmlCheatLines().count()).toBe(1);

  expect(elements.getCheatElementLegend(0).getText()).toBe('Cheat #1 remove');

  cheat
    .name('some cheat')
    .hacker('someone')
    .format('GameShark')
    .code(sampleCode);

  expect(cheatElementList.count()).toBe(1);
  expect(xmlCheatCount.getText()).toBe('"1"');
  errors.expect.toBeKoWithout('Cheats Errors');
  expect(elements.getXmlCheatLines().count()).toBe(1);

  const xmlCheat = elements.getXmlCheatWrapper(0);
  expectation.expectCheat(xmlCheat).toHave('"some cheat"', '"someone"', '"GameShark"', sampleCodeExpected.GameShark);

  elements.getCheatRemoveButton(0).click();
  expect(cheatElementList.count()).toBe(0);
  expect(xmlCheatCount.getText()).toBe('"0"');
  errors.expect.toBeKoWith('Cheats Errors', 'No cheat code');
  expect(elements.getXmlCheatLines().count()).toBe(0);
}

///////////////////////////////////////////////////////////////////////////

function addCheats(){
  browser.get('#/editor');

  const cheats = [
    elements.getCheatElementWrapper(0),
    elements.getCheatElementWrapper(1)
  ];
  const xmlCheats = [
    elements.getXmlCheatWrapper(0),
    elements.getXmlCheatWrapper(1)
  ];
  const expectedErrors = [];

  expect(cheatElementList.count()).toBe(0);
  expect(xmlCheatCount.getText()).toBe('"0"');
  errors.expect.toBeKoWith('Cheats Errors', 'No cheat code');
  expect(elements.getXmlCheatLines().count()).toBe(0);

  for(let j=0; j<cheats.length; j++){
    moreCheatButton.click();
    expectedErrors.push(`Cheat #${j+1} has no name`);
  }

  expect(cheatElementList.count()).toBe(cheats.length);
  expect(xmlCheatCount.getText()).toBe('"0"');
  errors.expect.toBeKoWith('Cheats Errors', expectedErrors);
  expect(elements.getXmlCheatLines().count()).toBe(cheats.length);

  cheats.forEach((cheat, i) => {
    expect(elements.getCheatElementLegend(i).getText()).toBe(`Cheat #${i+1} remove`);
    expectation.expectCheat(cheat).toHave('', '', 'GameShark', '');
  });

  cheats[0]
    .name('some cheat')
    .hacker('someone')
    .format('GameShark')
    .code('1234567812345678');

  expect(elements.getXmlCheatLines().count()).toBe(cheats.length);

  cheats[1]
    .name('another cheat')
    .hacker('another guy')
    .format('Game Genie')
    .code('ABCDEF');

  expect(elements.getXmlCheatLines().count()).toBe(cheats.length);
  expect(cheatElementList.count()).toBe(cheats.length);
  expect(xmlCheatCount.getText()).toBe(`"${cheats.length}"`);
  errors.expect.toBeKoWithout('Cheats Errors');

  expectation.expectCheat(cheats[0]).toHave('some cheat', 'someone', 'GameShark', '1234567812345678');
  expectation.expectCheat(cheats[1]).toHave('another cheat', 'another guy', 'Game Genie', 'ABCDEF');

  expectation.expectCheat(xmlCheats[0]).toHave('"some cheat"', '"someone"', '"GameShark"', '12345678,12345678');
  expectation.expectCheat(xmlCheats[1]).toHave('"another cheat"', '"another guy"', '"Game Genie"', 'ABCD:EF');
}

///////////////////////////////////////////////////////////////////////////

function removeCheats(){
  browser.get('#/editor');

  const cheat = elements.getCheatElementWrapper;
  const xmlCheat = elements.getXmlCheatWrapper;
  let cheatCount = 3;
  const expectedErrors = [];

  expect(cheatElementList.count()).toBe(0);
  expect(xmlCheatCount.getText()).toBe('"0"');
  errors.expect.toBeKoWith('Cheats Errors', 'No cheat code');
  expect(elements.getXmlCheatLines().count()).toBe(0);

  for(let j=0; j<cheatCount; j++){
    moreCheatButton.click();
    expectedErrors.push(`Cheat #${j+1} has no name`);
  }

  expect(cheatElementList.count()).toBe(cheatCount);
  expect(xmlCheatCount.getText()).toBe('"0"');
  errors.expect.toBeKoWith('Cheats Errors', expectedErrors);
  expect(elements.getXmlCheatLines().count()).toBe(cheatCount);

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
  expect(cheatElementList.count()).toBe(cheatCount);
  expect(xmlCheatCount.getText()).toBe(`"${cheatCount}"`);
  errors.expect.toBeKoWithout('Cheats Errors');

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
    expect(cheatElementList.count()).toBe(cheatCount);
    expect(xmlCheatCount.getText()).toBe(`"${cheatCount}"`);

    if(cheatCount > 0){
      errors.expect.toBeKoWithout('Cheats Errors');
    }else{
      errors.expect.toBeKoWith('Cheats Errors', 'No cheat code');
    }
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

  const cheat = elements.getCheatElementWrapper(0);

  expect(elements.getXmlCheatLines().count()).toBe(0);
  moreCheatButton.click();
  expect(elements.getXmlCheatLines().count()).toBe(1);
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
  expect(cheatElementList.count()).toBe(1);
  expect(xmlCheatCount.getText()).toBe('"1"');
  errors.expect.toBeKoWithout('Cheats Errors');

  expect(elements.getXmlCheatLines().count()).toBe(1);

  const xmlCheat = elements.getXmlCheatWrapper(0);
  expectation.expectCheat(xmlCheat).toHave('"some cheat"', '"someone"', '"GameShark"', sampleCodeExpected.GameShark);

  consoleDdl('NES');

  expectation.expectCheat(cheat).toHave('some cheat', 'someone', 'Raw', sampleCode);
  expectation.expectCheat(xmlCheat).toHave('"some cheat"', '"someone"', '"Raw"', sampleCodeExpected.Raw);

  cheat.code('');

  expect(cheat.placeHolder()).not.toBe('');
  expect(cheat.placeHolder()).not.toBe(oldPlaceHolder);

  elements.getCheatRemoveButton(0).click();
  expect(elements.getXmlCheatLines().count()).toBe(0);
  expect(cheatElementList.count()).toBe(0);
  moreCheatButton.click();
  expect(elements.getXmlCheatLines().count()).toBe(1);
  expect(cheatElementList.count()).toBe(1);

  cheat
    .name('some cheat')
    .hacker('someone')
    .code(sampleCode);

  expectation.expectCheat(cheat).toHave('some cheat', 'someone', 'Raw', sampleCode);
  expectation.expectCheat(xmlCheat).toHave('"some cheat"', '"someone"', '"Raw"', sampleCodeExpected.Raw);

  consoleDdl('Game Boy');
  expectation.expectCheat(cheat).toHave('some cheat', 'someone', 'GameShark', sampleCode);
  expectation.expectCheat(xmlCheat).toHave('"some cheat"', '"someone"', '"GameShark"', sampleCodeExpected.GameShark);
}

///////////////////////////////////////////////////////////////////////////

function resetCheat(cheat){
  cheat
    .name('')
    .hacker('')
    .format('GameShark')
    .code('');
}
