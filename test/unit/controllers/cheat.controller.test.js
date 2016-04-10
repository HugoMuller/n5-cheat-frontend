(function(){
  'use strict';

  let controller;
  let $controller;
  let $rootScope;

  describe('Editor Controller', () => {
    beforeEach(loadModule);
    beforeEach(injectThings);

    describe('init', () => {
      it('should init the controller', initTest);
      it('should update the placeHolder', updatePlaceHolderTest);
    });
  });

  //////////////////////////////////////////////////////////////////////////////

  function initTest(){
    controller = createWithParams();

    should(controller.cheat).be.undefined();
    should(controller.formats).be.undefined();
    should(controller.removeCheat).be.undefined();
    should(controller.placeHolder).be.undefined();
    should(controller.$onInit).be.a.Function();
    should(controller.$onChanges).be.a.Function();
    should(controller.updatePlaceHolder).be.a.Function();
  }

  //////////////////////////////////////////////////////////////////////////////

  function updatePlaceHolderTest(){
    const expected = 'expectedSample';

    controller = createWithParams({
      cheat: {
        format: 'GameShark'
      },
      formats: [
        {
          format: 'format1',
          sample: 'sample1'
        }, {
          format: 'GameShark',
          sample: expected
        }, {
          format: 'format3',
          sample: 'sample3'
        }
      ]
    });

    controller.updatePlaceHolder();
    should(controller.placeHolder).equal(expected);

    controller.cheat.format = 'unknown format';
    controller.updatePlaceHolder();
    should(controller.placeHolder).equal('');
  }

  //////////////////////////////////////////////////////////////////////////////

  function loadModule(){
    module('n5cheat');
    module('n5cheat.cheat');
  }

  function injectThings(){
    inject((_$controller_, _$rootScope_) => {
      $controller = _$controller_;
      $rootScope = _$rootScope_;
    });
  }

  function createWithParams(params){
    params = params || {};
    const _controller = $controller('CheatCtrl', $rootScope.$new());

    for(const p in params){
      if(params.hasOwnProperty(p)){
        _controller[p] = params[p];
      }
    }

    return _controller;
  }
})();
