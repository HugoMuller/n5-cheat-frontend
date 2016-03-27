(function(){
  'use strict';

  angular
    .module('n5cheat.filters')
    .filter('nonEmpty', nonEmpty);

  function nonEmpty(){
    return function(cheats){
      return cheats.filter((cheat) => cheat && cheat.format && cheat.name && cheat.formattedCode());
    };
  }
})();
