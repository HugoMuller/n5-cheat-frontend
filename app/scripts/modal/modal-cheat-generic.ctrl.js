(function(){
  'use strict';

  angular
    .module('n5cheat.modal')
    .controller('ModalGenericCheatCtrl', ModalGenericCheatCtrl);

  //////////////////////////////////////////////////////////////////////////////

  ModalGenericCheatCtrl.$inject = ['$uibModalInstance', '$timeout', 'input'];

  function ModalGenericCheatCtrl($uibModalInstance, $timeout, input){
    const vm = this;

    vm.save = save;
    vm.cancel = cancel;
    vm.valueIsValid = valueIsValid;
    vm.addValue = addValue;
    vm.removeValue = removeValue;

    init();

    return vm;

    function save(){
      $uibModalInstance.close(vm.cheat);

      return $uibModalInstance.result;
    }

    function cancel(){
      $uibModalInstance.dismiss('cancel');

      return $uibModalInstance.result;
    }

    function valueIsValid(id){
      const subCheat = vm.cheat.subCheats[id];
      const isValid = subCheat &&
        subCheat.name && subCheat.name.length > 0 &&
        subCheat.code && subCheat.code.length > 0;

      return !!isValid;
    }

    function addValue(){
      vm.cheat.subCheats.push({
        name: '',
        code: ''
      });

      $timeout(() => {
        const valueContent = document.getElementsByClassName('value-content')[0];
        valueContent.scrollTop = valueContent.scrollHeight;
      });
    }

    function removeValue(id){
      vm.cheat.subCheats.splice(id, 1);
    }

    ////////////////////////////////////////////////////////////////////////////

    function init(){
      vm.title = input.title;
      vm.placeHolder = input.placeHolder;
      vm.cheat = input.cheat;
    }
  }
}());
