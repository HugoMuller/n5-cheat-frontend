(function(){
  'use strict';

  angular
    .module('n5cheat.modal')
    .factory('modalGenericCheatFactory', modalGenericCheatFactory);

  //////////////////////////////////////////////////////////////////////////////

  modalGenericCheatFactory.$inject = ['$uibModal', 'modalFactory'];

  function modalGenericCheatFactory($uibModal, modalFactory){
    return {
      open
    };

    function open(cheat, placeHolder){
      return $uibModal
        .open(modalFactory.extend('ModalGenericCheat', {
          resolve: { input }
        }))
        .result;

      function input(){
        return {
          title: `Values for generic cheat #${cheat.computeCheatId()}`,
          placeHolder,
          cheat: _.cloneDeep(cheat)
        };
      }
    }
  }
}());
