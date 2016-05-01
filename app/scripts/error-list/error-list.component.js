(function(){
  'use strict';

  angular
    .module('n5cheat.errorList')
    .controller('ErrorListCtrl', ErrorListCtrl)
    .component('errorList', {
      templateUrl: 'scripts/error-list/error-list.html',
      controller: 'ErrorListCtrl as vm',
      bindings: {
        errorList: '=errors'
      }
    });

  //////////////////////////////////////////////////////////////////////////////

  ErrorListCtrl.$inject = ['ENV'];

  function ErrorListCtrl(ENV){
    const vm = this;

    vm.errorCount = errorCount;
    vm.gameErrorCount = gameErrorCount;
    vm.cheatErrorCount = cheatErrorCount;
    vm.hiddenCheatErrorCount = hiddenCheatErrorCount;

    function errorCount(){
      return gameErrorCount() + cheatErrorCount();
    }

    function gameErrorCount(){
      if(!vm.errorList) return 0;
      return _.size(vm.errorList.game);
    }

    function cheatErrorCount(){
      if(!vm.errorList) return 0;
      return _.size(vm.errorList.cheat);
    }

    function hiddenCheatErrorCount(){
      return Math.max(0, cheatErrorCount() - ENV.maxCheatErrorsDisplayed);
    }
  }
}());
