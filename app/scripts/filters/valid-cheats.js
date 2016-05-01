(function(){
  'use strict';

  angular
    .module('n5cheat.filters')
    .filter('validCheats', validCheats);

  //////////////////////////////////////////////////////////////////////////////

  function validCheats(){
    return (cheats) => cheats
      .filter((cheat) => cheat
        && cheat.format
        && cheat.name
        && angular.isFunction(cheat.sanitizedCode)
        && cheat.sanitizedCode()
      );
  }
}());
