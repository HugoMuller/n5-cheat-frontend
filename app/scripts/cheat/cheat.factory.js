(function(){
  'use strict';

  angular
    .module('n5cheat.cheat')
    .factory('cheatFactory', cheatFactory);

  const uniqueId = (function(){
    let uid = 0;
    return () => uid++;
  }());

  //////////////////////////////////////////////////////////////////////////////

  cheatFactory.$inject = ['formatCodeFilter'];

  function cheatFactory(formatCodeFilter){
    const factory = {
      create
    };

    return factory;

    /////////////////////////////////

    function create(cheats){
      return () => {
        const cheat = {};

        cheat.id = uniqueId();
        cheat.console = '';
        cheat.format = '';
        cheat.hacker = '';
        cheat.name = '';
        cheat.code = '';

        cheat.computeCheatId = computeCheatId;
        cheat.formatedCode = formatedCode;
        cheat.isValid = isValid;

        return cheat;

        ////////////////////////////////////////////////////////////////////////

        function computeCheatId(){
          return _.findIndex(cheats, { id: cheat.id }) + 1;
        }

        function formatedCode(){
          return formatCodeFilter(cheat.code, cheat.format, cheat.console);
        }

        function isValid(){
          const _isValid = cheat.format &&
            cheat.name &&
            angular.isFunction(cheat.formatedCode) &&
            cheat.formatedCode(cheat.console);

          return !!_isValid;
        }
      };
    }
  }
}());
