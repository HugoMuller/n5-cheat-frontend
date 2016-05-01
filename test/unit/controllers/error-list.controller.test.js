(function(){
  'use strict';

  let controller;
  let $controller;
  let $rootScope;
  let ENV;

  describe('ErrorList Controller (ErrorListCtrl)', () => {
    beforeEach(loadModule);
    beforeEach(injectThings);

    describe('initialization', () => {
      it('should initialize the controller', initTest);
    });

    describe('.errorCount', () => {
      it('should return total error count', errorCountTest);
    });

    describe('.gameErrorCount', () => {
      it('should return game error count', xErrorCountTest('gameErrorCount'));
    });

    describe('.cheatErrorCount', () => {
      it('should return cheat error count', xErrorCountTest('cheatErrorCount'));
    });

    describe('.hiddenCheatErrorCount', () => {
      it('should return the count of hidden cheat errors', hiddenCheatErrorCountTest);
    });
  });

  //////////////////////////////////////////////////////////////////////////////

  function initTest(){
    controller = createWithParams();

    should(controller.errorList).be.undefined();

    [
      'errorCount',
      'gameErrorCount',
      'cheatErrorCount',
      'hiddenCheatErrorCount',
    ].forEach((attr) => {
      should(controller[attr]).be.a.Function();
    });
  }

  //////////////////////////////////////////////////////////////////////////////

  function xErrorCountTest(fn){
    return () => {
      if(['gameErrorCount', 'cheatErrorCount'].indexOf(fn) === -1){
        throw new Error('xErrorCountTest designed to test "gameErrorCount" and "cheatErrorCount" functions');
      }

      const count = 5;
      const attr1 = fn === 'gameErrorCount' ? 'game' : 'cheat';
      const attr2 = fn === 'gameErrorCount' ? 'cheat' : 'game';
      controller = createWithParams();

      doTest(undefined, 0);
      doTest({}, 0);
      doTest({ [attr1]: {} }, 0);
      doTest({ [attr1]: obj(count) }, count);
      doTest({ [attr1]: obj(count), [attr2]: {} }, count);
    };

    function doTest(actual, expected){
      controller.errorList = actual;
      should(controller[fn]()).equal(expected);
    }
  }

  function errorCountTest(){
    const cheatCount = 5;
    const gameCount = 14;
    controller = createWithParams();

    doTest(undefined, 0);
    doTest({}, 0);
    doTest({ game: {} }, 0);
    doTest({ cheat: {} }, 0);
    doTest({ game: obj(gameCount) }, gameCount);
    doTest({ cheat: obj(cheatCount) }, cheatCount);
    doTest({ game: obj(gameCount), cheat: obj(cheatCount) }, gameCount + cheatCount);

    function doTest(actual, expected){
      controller.errorList = actual;
      should(controller.errorCount()).equal(expected);
    }
  }

  //////////////////////////////////////////////////////////////////////////////

  function hiddenCheatErrorCountTest(){
    const more = 10;

    controller = createWithParams({
      errorList: {
        game: Array(ENV.maxCheatErrorsDisplayed + 1)
      }
    });
    should(controller.hiddenCheatErrorCount()).equal(0);

    controller.errorList.cheat = [];
    should(controller.hiddenCheatErrorCount()).equal(0);

    controller.errorList.cheat = Array(ENV.maxCheatErrorsDisplayed);
    should(controller.hiddenCheatErrorCount()).equal(0);

    controller.errorList.cheat = Array(ENV.maxCheatErrorsDisplayed + more);
    should(controller.hiddenCheatErrorCount()).equal(more);
  }

  //////////////////////////////////////////////////////////////////////////////

  function loadModule(){
    module('n5cheat');
    module('n5cheat.errorList');
  }

  function injectThings(){
    inject((_$controller_, _$rootScope_, _ENV_) => {
      $controller = _$controller_;
      $rootScope = _$rootScope_;
      ENV = _ENV_;
    });
  }

  function createWithParams(params){
    return $controller('ErrorListCtrl', $rootScope.$new(), params || {});
  }

  function obj(n){
    const _obj = {};
    for(let i=0; i<n; i++) _obj[i] = 0;

    return _obj;
  }
}());
