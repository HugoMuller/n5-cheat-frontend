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

      it('should update cheat console if selected console has changed in game info', $onChangesConsoleTest);
      it('should update cheat format and placeholder if selected format has changed', $onChangesTest);
      it('should do nothing if no change happened', $onChangesNoneTest);

      afterEach(restoreSpy);
    });

    describe('.onFormatChanges', () => {
      beforeEach(createAndSpy);

      it('should call .updatePlaceHolder and .updateError', onFormatChangesTest);

      afterEach(restoreSpy);
    });

    describe('.updateError', () => {
      it('should call .manageError', updateErrorTest);
    });
  });

  //////////////////////////////////////////////////////////////////////////////

  function initTest(){
    controller = createWithParams();

    [
      'cheat',
      'formats',
      'removeCheat',
      'manageError',
      'placeHolder'
    ].forEach((attr) => {
      should(controller[attr]).be.undefined();
    });

    [
      '$onInit',
      '$onChanges',
      'updatePlaceHolder',
      'updateError',
      'onFormatChanges'
    ].forEach((attr) => {
      should(controller[attr]).be.a.Function();
    });
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

  function $onChangesConsoleTest(){
    const console = 'console';

    controller.console = console;
    controller.$onChanges({
      console: { currentValue: console }
    });

    should(controller.cheat.console).equal(console);
    should(controller.manageError.callCount).be.above(0);
  }

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
    should(controller.manageError.callCount).be.above(0);
  }

  function $onChangesNoneTest(){
    controller.cheat.format = 'format';
    controller.placeHolder = 'sample';
    controller.$onChanges({});

    should(controller.updatePlaceHolder.callCount).equal(0);
    should(controller.cheat.format).equal('format');
    should(controller.placeHolder).equal('sample');
    should(controller.manageError.callCount).be.above(0);
  }

  //////////////////////////////////////////////////////////////////////////////

  function onFormatChangesTest(){
    controller.manageError = sinon.stub();
    controller.onFormatChanges();

    should(controller.updatePlaceHolder.callCount).equal(1, 'expected updatePlaceHolder to be called once');
    should(controller.updateError.callCount).equal(1, 'expected updateError to be called once');
  }

  //////////////////////////////////////////////////////////////////////////////

  function updateErrorTest(){
    const cheat = { attr: 1 };
    controller = createWithParams({
      cheat,
      manageError: sinon.stub()
    });

    controller.updateError();
    should(controller.manageError.callCount).equal(1);
    should(controller.manageError.args[0][0]).eql({ cheat });
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
      console: 'gameboy',
      cheat: { format: '' },
      formats: [],
      manageError: sinon.stub()
    });
    sinon.spy(controller, 'updatePlaceHolder');
    sinon.spy(controller, 'updateError');
  }

  function restoreSpy(){
    controller.updatePlaceHolder.restore();
  }
}());
