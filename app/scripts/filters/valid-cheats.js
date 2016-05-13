(function(){
  'use strict';

  angular
    .module('n5cheat.filters')
    .filter('validCheats', validCheats);

  //////////////////////////////////////////////////////////////////////////////

  function validCheats(){
    return (cheats) => cheats
      .filter((cheat) => cheat &&
        angular.isFunction(cheat.isValid) &&
        cheat.isValid()
      );
  }
}());
