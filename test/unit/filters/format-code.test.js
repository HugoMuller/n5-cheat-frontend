(function(){
  'use strict';

  let formatCodeFilter;

  describe('Filters', () => {
    beforeEach(loadModule);
    beforeEach(injectThings);

    describe('Format Code (formatCode)', () => {
      it('should format a code with the given format', formatCodeTest);
      it('should not format a code if unknown format', noFormatCodeTest);
    });
  });

  //////////////////////////////////////////////////////////////////////////////

  function formatCodeTest(){
    const code = `abcdefghijklmnopqrstuvwxyz
      ABCDEFGHIJKLMNOPQRSTUVWXYZ
      012345679:0123 456 789:0,1&~#!`;

    [
      {
        console: 'gameboy',
        format: 'GameShark',
        expected: 'ABCDEFAB,CDEF0123,45679012,34567890'
      }, {
        console: 'gameboy',
        format: 'Game Genie',
        expected: 'ABCD:EF,ABCD:EF,0123:45,6790:12,3456:78'
      }, {
        console: 'gba',
        format: 'AR12',
        expected: 'ABCDEFAB:CDEF0123,45679012:34567890'
      }, {
        console: 'gba',
        format: 'AR34',
        expected: 'ABCDEFAB:CDEF0123,45679012:34567890'
      }, {
        console: 'gba',
        format: 'CB',
        expected: 'ABCDEFAB:CDEF,01234567:9012'
      }, {
        console: 'genesis',
        format: 'Game Genie',
        expected: 'ABCDEF:ABCD,EF0123:4567,901234:5678'
      }, {
        console: 'nes',
        format: 'Raw',
        expected: 'ABCD:EF,ABCD:EF,0123:45,6790:12,3456:78'
      }, {
        console: 'sms',
        format: 'Action Replay/GameShark',
        expected: 'ABCDEF:AB,CDEF01:23,456790:12,345678:90'
      }, {
        console: 'snes',
        format: 'Raw',
        expected: 'ABCDEF:AB,CDEF01:23,456790:12,345678:90'
      }
    ].forEach((params) => {
      let actual = formatCodeFilter(undefined, params.format, params.console);
      should(actual).equal('');

      actual = formatCodeFilter(code, params.format, params.console);
      should(actual).equal(params.expected);
    });
  }

  function noFormatCodeTest(){
    const code = `abcdefghijklmnopqrstuvwxyz
    ABCDEFGHIJKLMNOPQRSTUVWXYZ
    012345679:0123 456 789:0,1&~#!`;

    [
      formatCodeFilter(code, 'unknown format', 'gameboy'),
      formatCodeFilter(code, null, 'gameboy'),
      formatCodeFilter(code, undefined, 'gameboy'),
      formatCodeFilter(code, 'GameShark', 'unknown console'),
      formatCodeFilter(code, 'GameShark', null),
      formatCodeFilter(code, 'GameShark', undefined)
    ].forEach((actual) => {
      should(actual).equal('');
    });
  }

  //////////////////////////////////////////////////////////////////////////////

  function loadModule(){
    module('n5cheat');
    module('n5cheat.filters');
  }

  function injectThings(){
    inject((_formatCodeFilter_) => {
      formatCodeFilter = _formatCodeFilter_;
    });
  }
})();
