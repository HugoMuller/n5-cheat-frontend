(function(){
  'use strict';

  let formatCodeFilter;
  let validCheatsFilter;
  let ENV;

  describe('Filters', () => {
    beforeEach(loadModule);
    beforeEach(injectThings);

    describe('Format Code', () => {
      it('should format a code with the given format', formatCodeTest);
      it('should not format a code if unknown format', noFormatCodeTest);
    });

    describe('Valid Cheats', () => {
      it('should return an array of valid cheats', cheatValidTest);
    });
  });

  //////////////////////////////////////////////////////////////////////////////

  function formatCodeTest(){
    const codes = [
      undefined,
      `abcdefghijklmnopqrstuvwxyz
      ABCDEFGHIJKLMNOPQRSTUVWXYZ
      012345679:0123 456 789:0,1&~#!`
    ];

    const expected = [
      {
        GameShark: '',
        GameGenie: ''
      }, {
        GameShark: 'ABCDEFAB,CDEF0123,45679012,34567890',
        GameGenie: 'ABCD:EF,ABCD:EF,0123:45,6790:12,3456:78'
      }
    ];

    codes.forEach((code, i) => {
      Object
        .keys(ENV.codeFormat)
        .forEach(testFormatOnCode(code, i));
    });

    function testFormatOnCode(code, i){
      return (format) => {
        should(formatCodeFilter(code, ENV.codeFormat[format]))
          .equal(expected[i][format]);
      };
    }
  }

  function noFormatCodeTest(){
    const code = `abcdefghijklmnopqrstuvwxyz
    ABCDEFGHIJKLMNOPQRSTUVWXYZ
    012345679:0123 456 789:0,1&~#!`;

    should(formatCodeFilter(code, 'unknown format')).equal('ABCDEFABCDEF012345679012345678901');
  }

  //////////////////////////////////////////////////////////////////////////////

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
