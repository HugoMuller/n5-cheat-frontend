(function(){
  'use strict';

  let cheatService;
  let formatCodeFilter;

  describe('Cheat Service (cheatService)', () => {
    beforeEach(loadModule);
    beforeEach(mock);
    beforeEach(injectThings);

    describe('call', () => {
      it('should return a cheat object', initTest);
    });

    describe('.formatedCode', () => {
      it('should call formatCodeFilter', formatedCodeTest);
    });

    describe('.isValid', () => {
      it('should return true if cheat is valid', isValidTruthyTest);
      it('should return false if cheat is not valid', isValidFalsyTest);
    });
  });

  //////////////////////////////////////////////////////////////////////////////

  function initTest(){
    const cheats = [];
    let cheat = cheatService(cheats);
    cheats.push(cheat);

    should(cheat.id).equal(0);
    should(cheat.format).equal('');
    should(cheat.hacker).equal('');
    should(cheat.name).equal('');
    should(cheat.code).equal('');
    should(cheat.computeCheatId()).equal(1);

    cheat = cheatService(cheats);
    cheats.push(cheat);
    should(cheat.id).equal(1);
    should(cheat.computeCheatId()).equal(2);

    cheats[0] = undefined;
    cheat = cheatService(cheats);
    cheats.push(cheat);
    should(cheat.id).equal(2);
    should(cheat.computeCheatId()).equal(2);

    delete cheats[0];
    cheat = cheatService(cheats);
    cheats.push(cheat);
    should(cheat.id).equal(3);
    should(cheat.computeCheatId()).equal(3);
  }

  //////////////////////////////////////////////////////////////////////////////

  function formatedCodeTest(){
    const cheat = cheatService([]);
    const console = 'console';

    doTest(true);
    doTest(false);

    function doTest(expected){
      formatCodeFilter.reset();
      formatCodeFilter.returns(expected);

      should(cheat.formatedCode(console)).equal(expected);
      should(formatCodeFilter.callCount).equal(1);
      should(formatCodeFilter.args[0][0]).equal(cheat.code);
      should(formatCodeFilter.args[0][1]).equal(cheat.format);
      should(formatCodeFilter.args[0][2]).equal(console);
    }
  }

  //////////////////////////////////////////////////////////////////////////////

  function isValidTruthyTest(){
    const cheat = cheatService([]);
    const console = 'console';
    sinon.spy(cheat, 'formatedCode');

    formatCodeFilter.returns(true);
    cheat.name = 'name';
    cheat.format ='format';
    should(cheat.isValid(console)).equal(true);
    should(cheat.formatedCode.callCount).equal(1);
    should(cheat.formatedCode.args[0][0]).equal(console);
  }

  function isValidFalsyTest(){
    const cheat = cheatService([]);
    const console = 'console';
    sinon.spy(cheat, 'formatedCode');

    doTest('', '', true);
    doTest('', 'format', true);
    doTest('name', '', true);
    doTest('name', 'format', false, 1);

    function doTest(name, format, isValid, callCount){
      cheat.name = name;
      cheat.format = format;
      formatCodeFilter.returns(isValid);

      should(cheat.isValid(console)).equal(false);
      should(cheat.formatedCode.callCount).equal(callCount || 0);
    }
  }

  //////////////////////////////////////////////////////////////////////////////

  function loadModule(){
    module('n5cheat.cheat');
  }

  function mock(){
    formatCodeFilter = sinon.stub();

    module(($provide) => {
      $provide.value('formatCodeFilter', formatCodeFilter);
    });
  }

  function injectThings(){
    inject((_cheatService_) => {
      cheatService = _cheatService_;
    });
  }
}());
