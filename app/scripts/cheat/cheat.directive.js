(function(){
  'use strict';

  angular
    .module('n5cheat.cheat')
    .directive('cheat', Cheat);

  Cheat.$inject = [];

  function Cheat(){
    return {
      restrict: 'A',
      templateUrl: 'scripts/cheat/cheat.html',
      scope: {
        cheat: '=',
        formats: '=',
        removeCheat: '&removecheat',
        codePlaceHolder: '&codeplaceholder'
      }
    };
  }
})();
