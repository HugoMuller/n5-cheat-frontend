(function(){
  'use strict';

  let objLimitToFilter;

  describe('Filters', () => {
    beforeEach(loadModule);
    beforeEach(injectThings);

    describe('Object LimitTo (objLimitTo)', () => {
      it('should return the object as is if limit is not finite', notFiniteLimitTest);
      it('should return empty object if limit = 0', zeroLimitTest);
      it('should return the n first elements if limit > 0', positiveLimitTest);
      it('should return the n last elements if limit < 0', negativeLimitTest);
      it('should return the object as is if limit is unreachable', unreachableLimitTest);
    });
  });

  //////////////////////////////////////////////////////////////////////////////

  function notFiniteLimitTest(){
    const input = { attr: 1 };
    [
      -Infinity,
      Infinity,
      NaN,
      '',
      'one',
      null,
      undefined
    ].forEach((limit) => {
      should(objLimitToFilter(input, limit)).eql(input);
    });
  }

  //////////////////////////////////////////////////////////////////////////////

  function zeroLimitTest(){
    should(objLimitToFilter({ attr: 1 }, 0)).eql({});
  }

  //////////////////////////////////////////////////////////////////////////////

  function positiveLimitTest(){
    const limit = 2;
    const input = {
      attr: 1,
      whatever: 10,
      sample: 0,
      prop: 5
    };
    const expected = {
      attr: 1,
      prop: 5
    };

    should(objLimitToFilter(input, limit)).eql(expected);
  }

  //////////////////////////////////////////////////////////////////////////////

  function negativeLimitTest(){
    const limit = -2;
    const input = {
      attr: 1,
      whatever: 10,
      sample: 0,
      prop: 5
    };
    const expected = {
      whatever: 10,
      sample: 0,
    };

    should(objLimitToFilter(input, limit)).eql(expected);
  }

  //////////////////////////////////////////////////////////////////////////////

  function unreachableLimitTest(){
    const limit = 2;
    const input = { attr: 1 };

    should(objLimitToFilter(input, limit)).eql(input);
    should(objLimitToFilter(input, -limit)).eql(input);
  }

  //////////////////////////////////////////////////////////////////////////////

  function loadModule(){
    module('n5cheat');
    module('n5cheat.filters');
  }

  function injectThings(){
    inject((_objLimitToFilter_) => {
      objLimitToFilter = _objLimitToFilter_;
    });
  }
}());
