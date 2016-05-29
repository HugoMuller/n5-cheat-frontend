(function(){
  'use strict';

  angular
    .module('n5cheat.modal')
    .factory('modalFactory', modalFactory);

  //////////////////////////////////////////////////////////////////////////////

  modalFactory.$inject = [];

  function modalFactory(){
    const modals = {
      ModalGenericCheat: {
        backdrop: 'static',
        templateUrl: 'scripts/modal/modal-cheat-generic.html',
        controller: 'ModalGenericCheatCtrl as vm'
      }
    };

    const factory = {
      get,
      extend
    };

    return factory;

    function get(name){
      checkModalName(name);

      return _.clone(modals[name]);
    }

    function extend(name, extra){
      checkModalName(name);

      return _.assign({}, extra, modals[name]);
    }

    function checkModalName(name){
      if(!name){
        throw new Error('modal name required');
      }

      if(!modals.hasOwnProperty(name)){
        throw new Error(`modal ${name} does not exist`);
      }
    }
  }
}());
