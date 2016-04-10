(function(){
  'use strict';

  angular
    .module('n5cheat.filters')
    .filter('validCheats', validCheats);

  function validCheats(){
    return function(cheats){
      return cheats.filter(
        (cheat) => cheat
          && cheat.format
          && cheat.name
          && typeof cheat.sanitizedCode === 'function'
          && cheat.sanitizedCode()
      );
    };
  }
})();
