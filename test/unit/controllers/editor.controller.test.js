(function(){
  'use strict';

  let $document;
  let controller;
  let $controller;
  let $rootScope;
  let validCheatsFilter;
  let ENV;

  describe('Editor Controller', suite);

  function suite(){
    beforeEach(loadModule);
    beforeEach(mock);
    beforeEach(injectThings);

    describe('init', initSuite);
    //describe('.addCheat', addCheatSuite);
    //describe('.removeCheat', removeCheatSuite);
    describe('.countCheats', countCheatsSuite);
    describe('.getCodePlaceHolder', getCodePlaceHolderSuite);
    describe('.showXml', showXmlSuite);
    describe('.hasGameTitle', hasGameTitleSuite);
    describe('.hasVersionCrc', hasVersionCrcSuite);
    describe('.hasVersionTitle', hasVersionTitleSuite);
  }

  //////////////////////////////////////////////////////////////////////////////

  function initSuite(){
    it('should init the controller', initTest);
  }

  function initTest(){
    controller = createWithParams();

    expect(controller.availableFormats).toBeDefined();
    expect(controller.availableFormats.length).toBe(2);

    expect(controller.codePlaceHolders).toBeDefined();
    expect(controller.codePlaceHolders[ENV.codeFormat.GameShark]).toBeDefined();
    expect(controller.codePlaceHolders[ENV.codeFormat.GameGenie]).toBeDefined();

    expect(controller.game).toBeDefined();
    expect(controller.game.title).toBe('');

    expect(controller.version).toBeDefined();
    expect(controller.version.crc).toBe('');
    expect(controller.version.codeCount).toBe(0);
    expect(controller.version.title).toBe('');

    expect(controller.cheats).toBeDefined();
    expect(controller.cheats.length).toBe(0);

    expect(controller.addCheat).toEqual(jasmine.any(Function));
    expect(controller.removeCheat).toEqual(jasmine.any(Function));
    expect(controller.countCheats).toEqual(jasmine.any(Function));
    expect(controller.getCodePlaceHolder).toEqual(jasmine.any(Function));
    expect(controller.showXml).toEqual(jasmine.any(Function));
    expect(controller.hasGameTitle).toEqual(jasmine.any(Function));
    expect(controller.hasVersionCrc).toEqual(jasmine.any(Function));
    expect(controller.hasVersionTitle).toEqual(jasmine.any(Function));
  }

  //////////////////////////////////////////////////////////////////////////////

  function addCheatSuite(){
    it('should add a cheat', addCheatTest);
  }

  function addCheatTest(){
    controller = createWithParams();
    $rootScope.$apply();
    $rootScope.$digest();
    expect(controller.cheats.length).toBe(0);
    expect(getCheatElemCount()).toBe(0);

    for(let i=1; i<5; i++){
      controller.addCheat();
      expect(controller.cheats.length).toBe(i);
      expect(getCheatElemCount()).toBe(i);
    }
  }

  //////////////////////////////////////////////////////////////////////////////

  function removeCheatSuite(){

  }

  //////////////////////////////////////////////////////////////////////////////

  function countCheatsSuite(){
    it('should count cheats', countCheatsTest);
  }

  function countCheatsTest(){
    controller = createWithParams();

    [
      [],
      [1,2],
      [1,2,3,4,5]
    ].forEach((arr) => {
      validCheatsFilter.returns(arr);
      expect(controller.countCheats()).toBe(arr.length);
    });
  }

  //////////////////////////////////////////////////////////////////////////////

  function getCodePlaceHolderSuite(){
    it('should return the correct placeHolder', getCodePlaceHolderTest);
  }

  function getCodePlaceHolderTest(){
    controller = createWithParams();

    controller.cheats[0] = undefined;
    expect(controller.getCodePlaceHolder(0)).toBe('');

    controller.cheats[0] = { format: ENV.codeFormat.GameShark };
    expect(controller.getCodePlaceHolder(0)).toMatch(/^[A-Fa-f0-9:]+$/);

    controller.cheats[0].format = ENV.codeFormat.GameGenie;
    expect(controller.getCodePlaceHolder(0)).toMatch(/^[A-Fa-f0-9:]+$/);

    controller.cheats[0].format = 'some unknown format';
    expect(controller.getCodePlaceHolder(0)).toBe(undefined);

  }

  //////////////////////////////////////////////////////////////////////////////

  function showXmlSuite(){
    it('should return true', showXmlTruthyTest);
    it('should return false', showXmlFalsyTest);
  }

  function showXmlTruthyTest(){
    const stubs = {
      hasGameTitle: sinon.stub().returns(true),
      hasVersionCrc: sinon.stub().returns(true),
      hasVersionTitle: sinon.stub().returns(true),
      countCheats: sinon.stub().returns(1)
    };
    controller = createWithParams(stubs);
    expect(controller.showXml()).toBe(true);
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
      expect(controller.showXml()).toBe(false);
    }
  }

  //////////////////////////////////////////////////////////////////////////////

  function hasGameTitleSuite(){
    it('should return true', hasGameTitleTruthyTest);
    it('should return false', hasGameTitleFalsyTest);
  }

  function hasGameTitleTruthyTest(){
    controller = createWithParams({
      game: {
        title: 'title'
      }
    });
    expect(controller.hasGameTitle()).toBe(true);
  }

  function hasGameTitleFalsyTest(){
    controller = createWithParams();
    expect(controller.hasGameTitle()).toBe(false);
  }

  //////////////////////////////////////////////////////////////////////////////

  function hasVersionCrcSuite(){
    it('should return true', hasVersionCrcTruthyTest);
    it('should return false', hasVersionCrcFalsyTest);
  }

  function hasVersionCrcTruthyTest(){
    controller = createWithParams({
      version: {
        crc: '12345678'
      }
    });
    expect(controller.hasVersionCrc()).toBe(true);
  }

  function hasVersionCrcFalsyTest(){
    controller = createWithParams();

    [null, '', '123467', '123456789'].forEach(falsyTest);

    function falsyTest(crc){
      controller.version.crc = crc;
      expect(controller.hasVersionCrc()).toBe(false);
    }
  }

  //////////////////////////////////////////////////////////////////////////////

  function hasVersionTitleSuite(){
    it('should return true', hasVersionTitleTruthyTest);
    it('should return false', hasVersionTitleFalsyTest);
  }

  function hasVersionTitleTruthyTest(){
    controller = createWithParams({
      version: {
        title: 'title'
      }
    });
    expect(controller.hasVersionTitle()).toBe(true);
  }

  function hasVersionTitleFalsyTest(){
    controller = createWithParams();
    expect(controller.hasVersionTitle()).toBe(false);
  }

  //////////////////////////////////////////////////////////////////////////////

  function loadModule(){
    module('n5cheat');
    module('n5cheat.editor');
    module('n5cheat.cheat');
    module('n5cheat.filters');
    module('app/scripts/editor/editor.html');
    module('app/scripts/cheat/cheat.html');
  }

  function mock(){
    validCheatsFilter = sinon.stub();

    const cheatService = sinon.stub().returns({
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
    inject(($compile, _$document_, _$controller_, _$rootScope_, _ENV_) => {
      $document = _$document_;
      $controller = _$controller_;
      $rootScope = _$rootScope_;
      ENV = _ENV_;
      //$document.append($compile('<editor></editor>')($rootScope));
    });
  }

  function createWithParams(params){
    params = params || {};
    const _controller =  $controller('EditorCtrl', { $scope: $rootScope.$new() });

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
    return $document(document.querySelectorAll('#cheats-container > div[cheat]')).length;
  }
})();
