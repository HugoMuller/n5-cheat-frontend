(function(){
  'use strict';

  let controller;
  let $controller;
  let $rootScope;

  describe('Cheat Controller (CheatCtrl)', () => {
    beforeEach(loadModule);
    beforeEach(injectThings);

    describe('initialization', () => {
      it('should initialize the controller', initTest);
    });

    describe('.updatePlaceHolder', () => {
      it('should update the placeHolder', updatePlaceHolderTest);
    });

    describe('.$onInit', () => {
      beforeEach(createAndSpy);

      it('should initialize cheat format and placeholder', $onInitTest);
      it('should initialize cheat format and placeholder with empty string if no data provided', $onInitEmptyTest);

      afterEach(restoreSpy);
    });

    describe('.$onChanges', () => {
      beforeEach(createAndSpy);

      it('should update cheat format and placeholder if selected format has changed', $onChangesTest);
      it('should do nothing if no change happened', $onChangesNoneTest);

      afterEach(restoreSpy);
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
    const formats = [
      {
        format: 'format1',
        sample: 'sample1'
      }, {
        format: 'format2',
        sample: 'sample2'
      }, {
        format: 'format3',
        sample: 'sample3'
      }
    ];

    controller = createWithParams({
      cheat: {
        format: 'format1'
      },
      formats
    });

    formats.forEach(testFormat);
    testFormat({ format: 'unknown format', sample: '' });

    function testFormat(format){
      controller.cheat.format = format.format;
      controller.updatePlaceHolder();
      should(controller.placeHolder).equal(format.sample);
    }
  }

  //////////////////////////////////////////////////////////////////////////////

  function $onInitTest(){
    const format = {
      format: 'format1',
      sample: 'sample1'
    };

    controller.formats = [format];

    should(controller.cheat.format).equal('');
    should(controller.placeHolder).be.undefined();

    controller.$onInit();
    should(controller.cheat.format).equal(format.format);
    should(controller.placeHolder).equal(format.sample);
    should(controller.updatePlaceHolder.callCount).equal(1);
  }

  function $onInitEmptyTest(){
    should(controller.cheat.format).equal('');
    should(controller.placeHolder).be.undefined();

    controller.$onInit();
    should(controller.cheat.format).equal('');
    should(controller.placeHolder).equal('');
    should(controller.updatePlaceHolder.callCount).equal(1);
  }

  //////////////////////////////////////////////////////////////////////////////

  function $onChangesTest(){
    const formats = [
      {
        format: 'format1',
        sample: 'sample1'
      }, {
        format: 'format2',
        sample: 'sample2'
      }
    ];

    controller.formats = formats;
    controller.$onChanges({
      formats: { currentValue: formats }
    });

    should(controller.updatePlaceHolder.callCount).equal(1);
    should(controller.cheat.format).equal(formats[0].format);
    should(controller.placeHolder).equal(formats[0].sample);
  }

  function $onChangesNoneTest(){
    controller.cheat.format = 'format';
    controller.placeHolder = 'sample';
    controller.$onChanges({});

    should(controller.updatePlaceHolder.callCount).equal(0);
    should(controller.cheat.format).equal('format');
    should(controller.placeHolder).equal('sample');
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
    return $controller('CheatCtrl', $rootScope.$new(), params || {});
  }

  function createAndSpy(){
    controller = createWithParams({
      cheat: { format: '' },
      formats: []
    });
    sinon.spy(controller, 'updatePlaceHolder');
  }

  function restoreSpy(){
    controller.updatePlaceHolder.restore();
  }
}());
