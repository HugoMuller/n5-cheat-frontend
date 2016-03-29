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

    expect(cheat.id).toBe(0);
    expect(cheat.format).toBe('');
    expect(cheat.hacker).toBe('');
    expect(cheat.name).toBe('');
    expect(cheat.code).toBe('');
    expect(cheat.computeCheatId()).toBe(1);

    cheat = cheatService(cheats);
    cheats.push(cheat);
    expect(cheat.id).toBe(1);
    expect(cheat.computeCheatId()).toBe(2);

    cheats[0] = undefined;
    cheat = cheatService(cheats);
    cheats.push(cheat);
    expect(cheat.id).toBe(2);
    expect(cheat.computeCheatId()).toBe(2);

    delete cheats[0];
    cheat = cheatService(cheats);
    cheats.push(cheat);
    expect(cheat.id).toBe(3);
    expect(cheat.computeCheatId()).toBe(3);
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
      expect(cheat.sanitizedCode()).toBe(code.expected);
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
