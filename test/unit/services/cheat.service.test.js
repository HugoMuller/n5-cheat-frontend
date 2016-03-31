(function(){
  'use strict';

  let cheatService;

  describe('Cheat Service', suite);

  function suite(){
    beforeEach(loadModule);
    beforeEach(injectThings);

    it('it should return a cheat object', initTest);
    it('it should format a cheat code correctly', formattedCodeTest);
  }

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

  function formattedCodeTest(){
    const cheat = cheatService([]);

    [
      {
        actual: '   ',
        expected: ''
      }, {
        actual: `
        `,
        expected: ','
      }, {
        actual: `abcdefghijklmnopqrstuvwxyz
        ABCDEFGHIJKLMNOPQRSTUVWXYZ
        012345679:0123 456 789:0,1&~#!`,
        expected: 'ABCDEF,ABCDEF,012345679:0123456789:0,1'
      }
    ].forEach(testCode);

    function testCode(code){
      cheat.code = code.actual;
      should(cheat.sanitizedCode()).equal(code.expected);
    }
  }

  //////////////////////////////////////////////////////////////////////////////

  function loadModule(){
    module('n5cheat.cheat');
  }

  function injectThings(){
    inject((_cheatService_) => {
      cheatService = _cheatService_;
    });
  }
})();
