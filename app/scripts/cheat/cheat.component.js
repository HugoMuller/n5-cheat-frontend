(function(){
  'use strict';

  angular
    .module('n5cheat.cheat')
    .controller('CheatCtrl', CheatCtrl)
    .component('cheat', {
      templateUrl: 'scripts/cheat/cheat.html',
      controller: 'CheatCtrl as vm',
      bindings: {
        console: '<',
        cheat: '=',
        formats: '<',
        removeCheat: '&',
        manageError: '&'
      }
    });

  //////////////////////////////////////////////////////////////////////////////

  CheatCtrl.$inject = ['modalGenericCheatFactory'];

  function CheatCtrl(modalGenericCheatFactory){
    const vm = this;

    vm.$onInit = $onInit;
    vm.$onChanges = $onChanges;
    vm.updatePlaceHolder = updatePlaceHolder;
    vm.updateError = updateError;
    vm.onFormatChanges = onFormatChanges;
    vm.switchGenericMode = switchGenericMode;
    vm.editDerivedCheats = editDerivedCheats;

    function $onInit(){
      vm.cheat.console = vm.console;
      initCheatFormat(vm.formats);
    }

    function $onChanges(changesObj){
      if(changesObj.console){
        vm.cheat.console = changesObj.console.currentValue;
      }

      if(changesObj.formats){
        initCheatFormat(changesObj.formats.currentValue);
      }

      vm.updateError();
    }

    function updatePlaceHolder(){
      const formatInfo = _.find(vm.formats, { format: vm.cheat.format });
      vm.placeHolder = formatInfo ? formatInfo.sample : '';
    }

    function initCheatFormat(formats){
      const formatObj = formats[0];
      vm.cheat.format = formatObj ? formatObj.format : '';
      vm.updatePlaceHolder();
    }

    function onFormatChanges(){
      vm.updatePlaceHolder();
      vm.updateError();
    }

    function updateError(){
      vm.manageError({ cheat: vm.cheat });
    }

    function switchGenericMode(){
      vm.cheat.isGeneric = !vm.cheat.isGeneric;
    }

    function editDerivedCheats(){
      modalGenericCheatFactory
        .open(vm.cheat, vm.placeHolder)
        .then((result) => {
          console.log('that cheat was saved: ', result)
        }, (reason) => {
          console.log('canceld with reason: ', reason)
        });
    }
  }
}());
