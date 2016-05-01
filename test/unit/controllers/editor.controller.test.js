(function(){
  'use strict';

  let cheatService;
  let controller;
  let $anchorScroll;
  let $compile;
  let $controller;
  let $scope;
  let $timeout;
  let validCheatsFilter;
  let ENV;

  describe('Editor Controller (EditorCtrl)', () => {
    beforeEach(loadModule);
    beforeEach(mock);
    beforeEach(injectThings);

    describe('initialization', () => {
      it('should initialize the controller', initTest);
    });

    describe('.addCheat', () => {
      beforeEach(initDOM);

      it('should add a cheat', addCheatTest);
    });

    describe('.removeCheat', () => {
      beforeEach(initDOM);

      it('should remove a cheat', removeCheatTest);
    });

    describe('.countCheats', () => {
      it('should count cheats', countCheatsTest);
    });

    describe('.getAvailableFormats', () => {
      it('should return the correct available formats', getAvailableFormatsTest);
    });

    describe('.showXml', () => {
      it('should return true', showXmlTruthyTest);
      it('should return false', showXmlFalsyTest);
    });

    describe('.hasGameTitle', () => {
      it('should return true', hasGameTitleTruthyTest);
      it('should return false', hasGameTitleFalsyTest);
    });

    describe('.hasVersionCrc', () => {
      it('should return true', hasVersionCrcTruthyTest);
      it('should return false', hasVersionCrcFalsyTest);
    });

    describe('.hasVersionTitle', () => {
      it('should return true', hasVersionTitleTruthyTest);
      it('should return false', hasVersionTitleFalsyTest);
    });
  });

  //////////////////////////////////////////////////////////////////////////////

  function initTest(){
    controller = createWithParams();

    should(controller.consoles).not.be.undefined();
    should(controller.consoles).eql(ENV.consoles);

    should(controller.availableFormats).not.be.undefined();
    should(controller.availableFormats.length).equal(2);

    should(controller.content.game).not.be.undefined();
    should(controller.content.game.title).equal('');

    should(controller.content.version).not.be.undefined();
    should(controller.content.version.crc).equal('');
    should(controller.content.version.codeCount).equal(0);
    should(controller.content.version.title).equal('');

    should(controller.content.cheats).not.be.undefined();
    should(controller.content.cheats.length).equal(0);

    should(controller.content.console).not.be.undefined();
    should(controller.content.console).equal(ENV.defaults.console);

    [
      'addCheat',
      'removeCheat',
      'countCheats',
      'getAvailableFormats',
      'showXml',
      'hasGameTitle',
      'hasVersionCrc',
      'hasVersionTitle'
    ].forEach((fn) => should(controller[fn]).be.a.Function());
  }

  //////////////////////////////////////////////////////////////////////////////

  function addCheatTest(){
    controller = createWithParams();
    should(controller.content.cheats.length).equal(0);
    should(getCheatElemCount()).equal(0);

    for(let i=1; i<5; i++){
      controller.addCheat();

      should(controller.content.cheats.length).equal(i);
      should(getCheatElemCount()).equal(i);
      should($timeout.callCount).equal(1);

      const callback = $timeout.args[0][0];
      should(callback).be.a.Function();

      callback();
      should($anchorScroll.callCount).equal(1);
      should($anchorScroll.args[0][0]).equal('btn-add-cheat');

      $anchorScroll.reset();
      $timeout.reset();
    }
  }

  //////////////////////////////////////////////////////////////////////////////

  function removeCheatTest(){
    controller = createWithParams({
      content: {
        cheats: [cheatService()]
      }
    });

    angular
      .element(document.querySelector('#cheats-container'))
      .append('<cheat id="cheat-0"></cheat>');

    should(controller.content.cheats.length).equal(1);
    should(getCheatElemCount()).equal(1);

    controller.removeCheat(0);

    should(controller.content.cheats[0]).be.undefined();
    should(getCheatElemCount()).equal(0);
  }

  //////////////////////////////////////////////////////////////////////////////

  function countCheatsTest(){
    controller = createWithParams();

    [
      [],
      [1,2],
      [1,2,3,4,5]
    ].forEach((arr) => {
      validCheatsFilter.returns(arr);
      should(controller.countCheats()).equal(arr.length);
    });
  }

  //////////////////////////////////////////////////////////////////////////////

  function getAvailableFormatsTest(){
    Object
      .keys(ENV.consoles)
      .forEach((console) => {
        controller = createWithParams({
          content: {
            console
          }
        });

        controller.getAvailableFormats();
        should(controller.availableFormats).eql(ENV.codeFormats[console]);
      });
  }

  //////////////////////////////////////////////////////////////////////////////

  function showXmlTruthyTest(){
    const stubs = {
      hasGameTitle: sinon.stub().returns(true),
      hasVersionCrc: sinon.stub().returns(true),
      hasVersionTitle: sinon.stub().returns(true),
      countCheats: sinon.stub().returns(1)
    };
    controller = createWithParams(stubs);
    should(controller.showXml()).be.true();
  }

  function showXmlFalsyTest(){
    const stubs = {
      hasGameTitle: sinon.stub(),
      hasVersionCrc: sinon.stub(),
      hasVersionTitle: sinon.stub(),
      countCheats: sinon.stub()
    };
    controller = createWithParams(stubs);
    Object.keys(stubs).forEach(falsyTest);

    function falsyTest(stub){
      setTruthyStub(stubs, stub);
      stubs.countCheats.returns(stub === 'countCheats' ? 1 : 0);
      should(controller.showXml()).be.false();
    }
  }

  //////////////////////////////////////////////////////////////////////////////

  function hasGameTitleTruthyTest(){
    controller = createWithParams({
      content: {
        game: {
          title: 'title'
        }
      }
    });
    should(controller.hasGameTitle()).be.true();
  }

  function hasGameTitleFalsyTest(){
    controller = createWithParams();
    should(controller.hasGameTitle()).be.false();
  }

  //////////////////////////////////////////////////////////////////////////////

  function hasVersionCrcTruthyTest(){
    controller = createWithParams();

    [
      '01234567',
      '12345678',
      '0123ABCD',
      '0789CDEF',
      'FFFFFFFF',
      '00000000'
    ].forEach(crcShouldBe(true));
  }

  function hasVersionCrcFalsyTest(){
    controller = createWithParams();

    [
      null,
      undefined,
      '',
      '123467',
      '123456789',
      'ADC',
      '0FFFFFFFF',
      'GHIJKLMN'
    ].forEach(crcShouldBe(false));
  }

  function crcShouldBe(trueOrFalse){
    return (crc) => {
      controller.content.version.crc = crc;
      should(controller.hasVersionCrc()).equal(trueOrFalse);
    };
  }

  //////////////////////////////////////////////////////////////////////////////

  function hasVersionTitleTruthyTest(){
    controller = createWithParams({
      content: {
        version: {
          title: 'title'
        }
      }
    });
    should(controller.hasVersionTitle()).be.true();
  }

  function hasVersionTitleFalsyTest(){
    controller = createWithParams();
    should(controller.hasVersionTitle()).be.false();
  }

  //////////////////////////////////////////////////////////////////////////////

  function loadModule(){
    module('n5cheat');
    module('n5cheat.editor');
    module('n5cheat.cheat');
    module('templates');
  }

  function mock(){
    $anchorScroll = sinon.stub();
    $timeout = sinon.stub();
    validCheatsFilter = sinon.stub().returns([]);

    cheatService = sinon.stub().returns({
      id: 0,
      format: 'format',
      hacker: 'hacker',
      name: 'name',
      computeCheatId: 1,
      sanitizedCode: sinon.stub().returns(true)
    });

    module(($provide) => {
      $provide.value('$anchorScroll', $anchorScroll);
      $provide.value('$timeout', $timeout);
      $provide.value('validCheatsFilter', validCheatsFilter);
      $provide.value('cheatService', cheatService);
    });
  }

  function injectThings(){
    inject((_$compile_, _$controller_, $rootScope, _ENV_) => {
      $compile = _$compile_;
      $controller = _$controller_;
      $scope = $rootScope.$new();
      ENV = _ENV_;
    });
  }

  function initDOM(){
    const editor = $compile('<editor></editor>')($scope);
    $scope.$digest();

    angular
      .element(document.body)
      .html(editor.html());
  }

  function createWithParams(params){
    params = params || {};
    const _controller = $controller('EditorCtrl', { $scope });

    for(const p in params){
      if(params.hasOwnProperty(p)){
        _controller[p] = params[p];
      }
    }

    return _controller;
  }

  function setTruthyStub(stubs, truthyStub){
    for(const stubName in stubs){
      if(stubs.hasOwnProperty(stubName)){
        stubs[stubName].returns(stubName === truthyStub);
      }
    }
  }

  function getCheatElemCount(){
    return angular
      .element(document.querySelectorAll('#cheats-container cheat'))
      .length;
  }
}());
