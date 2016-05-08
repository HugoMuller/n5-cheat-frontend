(function(){
  'use strict';

  let cheatFactory;
  let formatCodeFilter;

  describe('Cheat Factory (cheatFactory)', () => {
    beforeEach(loadModule);
    beforeEach(mock);
    beforeEach(injectThings);

    describe('call', () => {
      it('should return a function that creates a cheat object', initTest);
    });

    describe('cheat object', () => {
      describe('.computeCheatId', () => {
        it('should return a 1-based cheat index', computeCheatIdTest);
      });

      describe('.formatedCode', () => {
        it('should call formatCodeFilter', formatedCodeTest);
      });

      describe('.isValid', () => {
        it('should return true if cheat is valid', isValidTruthyTest);
        it('should return false if cheat is not valid', isValidFalsyTest);
      });
    });
  });

  //////////////////////////////////////////////////////////////////////////////

  function initTest(){
    const cheats = [];
    const createCheat = cheatFactory.create(cheats);

    should(createCheat).be.a.Function();

    let cheat = createCheat();
    cheats.push(cheat);

    should(cheat.id).equal(0);
    should(cheat.format).equal('');
    should(cheat.hacker).equal('');
    should(cheat.name).equal('');
    should(cheat.code).equal('');
    should(cheat.computeCheatId()).equal(1);

    cheat = createCheat();
    cheats.push(cheat);
    should(cheat.id).equal(1);
    should(cheat.computeCheatId()).equal(2);

    cheats.splice(0, 1);
    cheat = createCheat(cheats);
    cheats.push(cheat);
    should(cheat.id).equal(2);
    should(cheat.computeCheatId()).equal(2);

    cheats.splice(0, 1);
    cheat = createCheat();
    cheats.push(cheat);
    should(cheat.id).equal(3);
    should(cheat.computeCheatId()).equal(2);
  }

  //////////////////////////////////////////////////////////////////////////////

  function computeCheatIdTest(){
    const cheats = [];
    const createCheat = cheatFactory.create(cheats);
    cheats.push(createCheat());
    cheats.push(createCheat());

    should(cheats[0].computeCheatId()).equal(1);
    should(cheats[1].computeCheatId()).equal(2);
  }

  //////////////////////////////////////////////////////////////////////////////

  function formatedCodeTest(){
    const createCheat = cheatFactory.create([]);
    const cheat = createCheat();
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
    const createCheat = cheatFactory.create([]);
    const cheat = createCheat();
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
    const createCheat = cheatFactory.create([]);
    const cheat = createCheat();
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
    inject((_cheatFactory_) => {
      cheatFactory = _cheatFactory_;
    });
  }
}());
