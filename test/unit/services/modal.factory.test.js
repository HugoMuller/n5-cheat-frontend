(function(){
  'use strict';

  let modalFactory;

  describe('Modal Factory (modalFactory)', () => {
    beforeEach(loadModule);
    beforeEach(injectThings);

    describe('.get', () => {
      it('should return a modal spec', getTest);
      it('should throw an error if no modal provided', throwNoneTest('get'));
      it('should throw an error if modal unknown', throwUnknownTest('get'));
    });

    describe('.extend', () => {
      it('should return an extended modal spec', extendTest);
      it('should throw an error if no modal provided', throwNoneTest('extend'));
      it('should throw an error if modal unknown', throwUnknownTest('extend'));
    });
  });

  //////////////////////////////////////////////////////////////////////////////

  function getTest(){
    checkBasis(modalFactory.get('ModalGenericCheat'));
  }

  function extendTest(){
    const extra = {
      something: 'awesome'
    };
    const modal = modalFactory.extend('ModalGenericCheat', extra);

    checkBasis(modal);
    should(modal.something).equal(extra.something);
  }

  //////////////////////////////////////////////////////////////////////////////

  function checkBasis(modal){
    should(modal).not.be.undefined();
    should(modal.controller).be.a.String();
    should(modal.controller).not.be.empty();
  }

  function throwNoneTest(method){
    return () => {
      should(() => modalFactory[method]()).throw('modal name required');
    };
  }

  function throwUnknownTest(method){
    return () => {
      const name = 'unknown';
      should(() => modalFactory[method](name)).throw(`modal ${name} does not exist`);
    };
  }

  //////////////////////////////////////////////////////////////////////////////

  function loadModule(){
    module('n5cheat.modal');
  }

  function injectThings(){
    inject((_modalFactory_) => {
      modalFactory = _modalFactory_;
    });
  }
}());
