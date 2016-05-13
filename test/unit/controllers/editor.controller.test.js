(function(){
  'use strict';

  let cheatFactory;
  let createCheat;
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

    describe('.getCheatById', () => {
      it('should return the right cheat', getCheatByIdTest);
    });

    describe('.onGameTitleChanges', () => {
      it('should delete the gameTitle error if game title is set', onGameTitleChangesTruthyTest);
      it('should set the gameTitle error if game has no title', onGameTitleChangesFalsyTest);
    });

    describe('.onVersionCrcChanges', () => {
      it('should delete the versionCrc error if CRC is set', onVersionCrcChangesTruthyTest);
      it('should set the versionCrc error if game has no CRC', onVersionCrcChangesFalsyTest);
    });

    describe('.onVersionTitleChanges', () => {
      it('should delete the versionTitle error if version title is set', onVersionTitleChangesTruthyTest);
      it('should set the versionTitle error if game has no version title', onVersionTitleChangesFalsyTest);
    });

    describe('.onAddCheat', () => {
      it('should remove noCheat', onAddCheatRemoveNoCheatTest);
      it('should remove the error if cheat is valid', onAddCheatRemoveErrorTest);
      it('should add a name error if cheat has no name', onAddCheatAddNameErrorTest);
      it('should add a code error if cheat code is invalid', onAddCheatAddCodeErrorTest);
      it('should add a format error if cheat has no format', onAddCheatAddFormatErrorTest);
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
      'hasGameTitle',
      'hasVersionCrc',
      'hasVersionTitle',
      'onGameTitleChanges',
      'onVersionCrcChanges',
      'onVersionTitleChanges',
      'onAddCheat'
    ].forEach((fn) => should(controller[fn]).be.a.Function());

    should(cheatFactory.create.callCount).equal(1);
    should(cheatFactory.create.args[0][0]).equal(controller.content.cheats);
  }

  //////////////////////////////////////////////////////////////////////////////

  function addCheatTest(){
    controller = createWithParams();
    sinon.spy(controller, 'onAddCheat');

    should(controller.content.cheats.length).equal(0);
    should(getCheatElemCount()).equal(0);

    for(let i=1; i<5; i++){
      createCheat.reset();
      controller.onAddCheat.reset();
      controller.addCheat();

      should(createCheat.callCount).equal(1);
      should(controller.content.cheats.length).equal(i);
      should(getCheatElemCount()).equal(i);
      should($timeout.callCount).equal(1);
      should(controller.onAddCheat.callCount).equal(1);

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
        cheats: [createCheat()]
      }
    });

    const scope = $scope.$new();
    const destroy = sinon.stub(scope, '$destroy');
    const cheatElem = $compile(angular.element('<cheat id="cheat-0"></cheat>'))(scope);

    angular
      .element(document.querySelector('#cheats-container'))
      .append(cheatElem);

    should(controller.content.cheats.length).equal(1);
    should(getCheatElemCount()).equal(1);

    controller.removeCheat(0);

    should(destroy.callCount).equal(1);
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

  function getCheatByIdTest(){
    const cheats = [
      { id: 10 },
      { id: 11 },
      { id: 12 }
    ];
    controller = createWithParams({ content: { cheats } });
    should(controller.getCheatById(10)).equal(cheats[0]);
    should(controller.getCheatById(11)).equal(cheats[1]);
    should(controller.getCheatById(12)).equal(cheats[2]);
    should(controller.getCheatById(13)).be.undefined();
  }

  //////////////////////////////////////////////////////////////////////////////

  function onGameTitleChangesTruthyTest(){
    controller = createWithParams({
      content: {
        game: { title: 'title' }
      },
      errorList: {
        game: {
          gameTitle: { message: 'message', action: 'action' }
        }
      }
    });

    controller.onGameTitleChanges();
    should(controller.errorList.game).not.have.property('gameTitle');
  }

  function onGameTitleChangesFalsyTest(){
    controller = createWithParams();

    controller.onGameTitleChanges();
    should(controller.errorList.game).have.property('gameTitle');
  }

  //////////////////////////////////////////////////////////////////////////////

  function onVersionTitleChangesTruthyTest(){
    controller = createWithParams({
      content: {
        version: { title: 'title' }
      },
      errorList: {
        game: {
          versionTitle: { message: 'message', action: 'action' }
        }
      }
    });

    controller.onVersionTitleChanges();
    should(controller.errorList.game).not.have.property('versionTitle');
  }

  function onVersionTitleChangesFalsyTest(){
    controller = createWithParams();

    controller.onVersionTitleChanges();
    should(controller.errorList.game).have.property('versionTitle');
  }

  //////////////////////////////////////////////////////////////////////////////

  function onVersionCrcChangesTruthyTest(){
    controller = createWithParams({
      content: {
        version: { crc: '01234567' }
      },
      errorList: {
        game: {
          versionCrc: { message: 'message', action: 'action' }
        }
      }
    });

    controller.onVersionCrcChanges();
    should(controller.errorList.game).not.have.property('versionCrc');
  }

  function onVersionCrcChangesFalsyTest(){
    controller = createWithParams();

    controller.onVersionCrcChanges();
    should(controller.errorList.game).have.property('versionCrc');
  }

  //////////////////////////////////////////////////////////////////////////////

  function onAddCheatRemoveNoCheatTest(){
    const cheat = createCheat();
    controller = createWithParams({
      content: { cheats: [cheat] },
      errorList: {
        cheat: {
          noCheat: { message: 'message', action: 'action' }
        }
      }
    });

    controller.onAddCheat(0, cheat);
    should(controller.errorList.cheat).not.have.property('noCheat');
  }

  function onAddCheatRemoveErrorTest(){
    const id = 0;
    const cheat = createCheat();
    controller = createWithParams({
      content: { cheats: [cheat] },
      errorList: {
        cheat: {
          noCheat: { message: 'message', action: 'action' },
          [id]: { message: 'message', action: 'action' }
        }
      }
    });

    controller.onAddCheat(id, cheat);
    should(controller.errorList.cheat).not.have.property(id);
  }

  function onAddCheatAddNameErrorTest(){
    const id = 0;
    const cheat = createCheat();
    cheat.name = '';
    cheat.isValid.returns(false);
    cheat.formatedCode.returns(true);

    controller = createWithParams({
      content: { cheats: [cheat] }
    });

    controller.onAddCheat(id, cheat);
    should(controller.errorList.cheat).have.property(id);
    should(controller.errorList.cheat[id].message).be.a.Function();
    should(controller.errorList.cheat[id].message()).containEql('no name');
  }

  function onAddCheatAddCodeErrorTest(){
    const id = 0;
    const cheat = createCheat();
    cheat.isValid.returns(false);
    cheat.formatedCode.returns(false);

    controller = createWithParams({
      content: { cheats: [cheat] }
    });

    controller.onAddCheat(id, cheat);
    should(controller.errorList.cheat).have.property(id);
    should(controller.errorList.cheat[id].message()).containEql('invalid code');
  }

  function onAddCheatAddFormatErrorTest(){
    const id = 0;
    const cheat = createCheat();
    cheat.format = '';
    cheat.isValid.returns(false);
    cheat.formatedCode.returns(true);

    controller = createWithParams({
      content: { cheats: [cheat] }
    });

    controller.onAddCheat(id, cheat);
    should(controller.errorList.cheat).have.property(id);
    should(controller.errorList.cheat[id].message()).containEql('no format');
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

    createCheat = sinon.stub().returns({
      id: 0,
      format: 'format',
      hacker: 'hacker',
      name: 'name',
      computeCheatId: sinon.stub().returns(1),
      isValid: sinon.stub().returns(true),
      formatedCode: sinon.stub()
    });
    cheatFactory = {
      create: sinon.stub()
    };
    cheatFactory.create.returns(createCheat);

    module(($provide) => {
      $provide.value('$anchorScroll', $anchorScroll);
      $provide.value('$timeout', $timeout);
      $provide.value('validCheatsFilter', validCheatsFilter);
      $provide.value('cheatFactory', cheatFactory);
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

  function getCheatElemCount(){
    return angular
      .element(document.querySelectorAll('#cheats-container cheat'))
      .length;
  }
}());
