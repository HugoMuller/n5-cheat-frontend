(function(){
  'use strict';

  let controller;
  let $controller;
  let $rootScope;
  let $location;
  const endPoints = [ 'isHomeActive', 'isEditorActive'];

  describe('Navbar Controller', () => {
    beforeEach(loadModule);
    beforeEach(mock);
    beforeEach(injectThings);

    describe('init', () => {
      it('should init the controller', initTest);
    });

    describe('tab selection', () => {
      it('should activate home tab', homeTabTest);
      it('should activate editor tab', editorTabTest);
    });
  });

  //////////////////////////////////////////////////////////////////////////////

  function initTest(){
    controller = createWithParams();

    endPoints.forEach((endPoint) => {
      should(controller[endPoint]).be.a.Function();
    });
  }

  //////////////////////////////////////////////////////////////////////////////

  function homeTabTest(){
    $location.path.returns('/');
    controller = createWithParams();

    endPoints.forEach(testEndPoint(controller, 'isHomeActive'));
  }

  //////////////////////////////////////////////////////////////////////////////

  function editorTabTest(){
    $location.path.returns('/editor');
    controller = createWithParams();

    endPoints.forEach(testEndPoint(controller, 'isEditorActive'));
  }

  //////////////////////////////////////////////////////////////////////////////

  function testEndPoint(_controller, truthyEndPoint){
    return (actualEndPoint) => {
      should(_controller[actualEndPoint]()).equal(actualEndPoint === truthyEndPoint);
    };
  }

  //////////////////////////////////////////////////////////////////////////////

  function loadModule(){
    module('n5cheat.navbar');
  }

  function mock(){
    $location = {
      path: sinon.stub()
    };

    module(($provide) => {
      $provide.value('$location', $location);
    });
  }

  function injectThings(){
    inject((_$controller_, _$rootScope_) => {
      $controller = _$controller_;
      $rootScope = _$rootScope_;
    });
  }

  function createWithParams(params){
    params = params || {};
    const _controller = $controller('NavbarCtrl', $rootScope.$new());

    for(const p in params){
      if(params.hasOwnProperty(p)){
        _controller[p] = params[p];
      }
    }

    return _controller;
  }
})();
