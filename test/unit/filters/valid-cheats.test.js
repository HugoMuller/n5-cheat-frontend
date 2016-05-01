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
    const validCheat = { isValid: sinon.stub().returns(true) };

    const cheats = [
      null,
      { isValid: sinon.stub().returns(false) },
      validCheat,
      { isValid: 'notAfunction' }
    ];

    should(validCheatsFilter(cheats).length).eql(1);
    should(validCheatsFilter(cheats)).eql([validCheat]);
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
}());
