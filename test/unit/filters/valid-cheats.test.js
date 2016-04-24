(function(){
  'use strict';

  let validCheatsFilter;

  describe('Filters', () => {
    beforeEach(loadModule);
    beforeEach(injectThings);

    describe('Valid Cheats (validCheats)', () => {
      it('should return an array of valid cheats', cheatValidTest);
    });
  });

  //////////////////////////////////////////////////////////////////////////////

  function cheatValidTest(){
    const validCheat = fakeCheat('format', 'name', true);

    const cheats = [
      null,
      fakeCheat(null, 'name', true),
      fakeCheat('format', null, true),
      fakeCheat('format', 'name', false),
      validCheat,
      {
        format: 'format',
        name: 'name',
        sanitizedCode: 'notAfunction'
      }
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
    module('n5cheat.filters');
  }

  function injectThings(){
    inject((_validCheatsFilter_) => {
      validCheatsFilter = _validCheatsFilter_;
    });
  }
})();
