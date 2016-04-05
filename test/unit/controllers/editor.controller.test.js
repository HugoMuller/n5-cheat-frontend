(function(){
  'use strict';

  let cheatService;
  let controller;
  let $compile;
  let $controller;
  let $scope;
  let validCheatsFilter;
  let ENV;

  describe('Editor Controller', () => {
    beforeEach(loadModule);
    beforeEach(mock);
    beforeEach(injectThings);

    describe('init', () => {
      it('should init the controller', initTest);
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

    describe('.getCodePlaceHolder', () => {
      it('should return the correct placeHolder', getCodePlaceHolderTest);
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

    should(controller.availableFormats).not.be.undefined();
    should(controller.availableFormats.length).equal(2);

    should(controller.codePlaceHolders).not.be.undefined();
    should(controller.codePlaceHolders[ENV.codeFormat.GameShark]).not.be.undefined();
    should(controller.codePlaceHolders[ENV.codeFormat.GameGenie]).not.be.undefined();

    should(controller.game).not.be.undefined();
    should(controller.game.title).equal('');

    should(controller.version).not.be.undefined();
    should(controller.version.crc).equal('');
    should(controller.version.codeCount).equal(0);
    should(controller.version.title).equal('');

    should(controller.cheats).not.be.undefined();
    should(controller.cheats.length).equal(0);

    [
      'addCheat',
      'countCheats',
      'getCodePlaceHolder',
      'hasGameTitle',
      'hasVersionCrc',
      'hasVersionTitle',
      'removeCheat',
      'showXml'
    ].forEach((fn) => should(controller[fn]).be.a.Function());
  }

  //////////////////////////////////////////////////////////////////////////////

  function addCheatTest(){
    controller = createWithParams();
    should(controller.cheats.length).equal(0);
    should(getCheatElemCount()).equal(0);

    for(let i=1; i<5; i++){
      controller.addCheat();
      should(controller.cheats.length).equal(i);
      should(getCheatElemCount()).equal(i);
    }
  }

  //////////////////////////////////////////////////////////////////////////////

  function removeCheatTest(){
    controller = createWithParams({
      cheats: [cheatService()]
    });
    addFakeCheatInDOM();

    should(controller.cheats.length).equal(1);
    should(getCheatElemCount()).equal(1);

    controller.removeCheat(0);

    should(controller.cheats[0]).be.undefined();
    should(getCheatElemCount()).equal(0);

    function addFakeCheatInDOM(){
      const cheat = $compile(`<cheat cheat="vm.cheats[0]"
        id="cheat-0"
        formats="vm.availableFormats"
        remove-cheat="vm.removeCheat(0)"
        code-place-holder="vm.getCodePlaceHolder(0)"></cheat>`)($scope);
      $scope.$digest();

      angular
        .element(document.querySelector('#cheats-container'))
        .append(cheat);
    }
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

  function getCodePlaceHolderTest(){
    controller = createWithParams();

    controller.cheats[0] = undefined;
    should(controller.getCodePlaceHolder(0)).equal('');

    controller.cheats[0] = { format: ENV.codeFormat.GameShark };
    should(controller.getCodePlaceHolder(0)).match(/^[A-Fa-f0-9:]+$/);

    controller.cheats[0].format = ENV.codeFormat.GameGenie;
    should(controller.getCodePlaceHolder(0)).match(/^[A-Fa-f0-9:]+$/);

    controller.cheats[0].format = 'some unknown format';
    should(controller.getCodePlaceHolder(0)).be.undefined();

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
      game: {
        title: 'title'
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
      controller.version.crc = crc;
      should(controller.hasVersionCrc()).equal(trueOrFalse);
    };
  }

  //////////////////////////////////////////////////////////////////////////////

  function hasVersionTitleTruthyTest(){
    controller = createWithParams({
      version: {
        title: 'title'
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
})();
