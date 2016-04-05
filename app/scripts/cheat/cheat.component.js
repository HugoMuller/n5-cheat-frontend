(function(){
  'use strict';

  angular
    .module('n5cheat.cheat')
    .controller('CheatCtrl', CheatCtrl)
    .component('cheat', {
      templateUrl: 'scripts/cheat/cheat.html',
      controller: 'CheatCtrl as vm',
      bindings: {
        cheat: '=',
        formats: '=',
        removeCheat: '&',
        codePlaceHolder: '&'
      }
    });

  //////////////////////////////////////////////////////////////////////////////

  CheatCtrl.$inject = [];

  function CheatCtrl(){}
})();
