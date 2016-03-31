(function(){
  'use strict';

  let formatCodeFilter;
  let validCheatsFilter;
  let ENV;

  describe('Filters', suite);

  function suite(){
    beforeEach(loadModule);
    beforeEach(injectThings);

    describe('Format Code', formatCodeSuite);
    describe('Valid Cheats', validCheatsSuite);
  }

  //////////////////////////////////////////////////////////////////////////////

  function formatCodeSuite(){
    it('should format a code with the given format', formatCodeTest);
  }

  function formatCodeTest(){
    const code = `abcdefghijklmnopqrstuvwxyz
    ABCDEFGHIJKLMNOPQRSTUVWXYZ
    012345679:0123 456 789:0,1&~#!`;

    const expected = {
      GameShark: 'ABCDEFAB,CDEF0123,45679012,34567890',
      GameGenie: 'ABCD:EF,ABCD:EF,0123:45,6790:12,3456:78'
    };

    Object.keys(ENV.codeFormat).forEach(testOneFormat);

    function testOneFormat(format){
      should(formatCodeFilter(code, ENV.codeFormat[format])).equal(expected[format]);
    }
  }

  //////////////////////////////////////////////////////////////////////////////

  function validCheatsSuite(){
    it('should return an array of valid cheats', cheatValidTest);
  }

  function cheatValidTest(){
    const validCheat = fakeCheat('format', 'name', true);

    const cheats = [
      null,
      fakeCheat(null, 'name', true),
      fakeCheat('format', null, true),
      fakeCheat('format', 'name', false),
      validCheat
    ];

    should(validCheatsFilter(cheats)).eql([validCheat]);

    function fakeCheat(format, name, sanitized){
      return {
        format: format || '',
        name: name || '',
        sanitizedCode: sinon.stub().returns(sanitized)
      };
    }
  }

  //////////////////////////////////////////////////////////////////////////////

  function loadModule(){
    module('n5cheat');
    module('n5cheat.filters');
  }

  function injectThings(){
    inject((_formatCodeFilter_, _validCheatsFilter_, _ENV_) => {
      formatCodeFilter = _formatCodeFilter_;
      validCheatsFilter = _validCheatsFilter_;
      ENV = _ENV_;
    });
  }

})();
