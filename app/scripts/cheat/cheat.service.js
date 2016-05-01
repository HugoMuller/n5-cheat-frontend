(function(){
  'use strict';

  angular
    .module('n5cheat.cheat')
    .factory('cheatService', cheatService);

  const uniqueId = (function(){
    let uid = 0;
    return () => uid++;
  }());

  //////////////////////////////////////////////////////////////////////////////

  cheatService.$inject = ['formatCodeFilter'];

  function cheatService(formatCodeFilter){
    return (cheats) => {
      const that = {};

      that.id = uniqueId();
      that.format = '';
      that.hacker = '';
      that.name = '';
      that.code = '';

      that.computeCheatId = computeCheatIdFromCheats(cheats);
      that.formatedCode = formatedCode;
      that.isValid = isValid;

      return that;

    ///////////////////////////////////////////////////////////////////////////

      function computeCheatIdFromCheats(_cheats){
        return () => {
          const id = that.id;
          let _id = 0;

          _cheats.some((cheat) => {
            if(!cheat) return false;
            _id++;
            return cheat.id === id;
          });

          return _id;
        };
      }

      function formatedCode(console){
        return formatCodeFilter(that.code, that.format, console);
      }

      function isValid(console){
        const _isValid = that.format &&
          that.name &&
          angular.isFunction(that.formatedCode) &&
          that.formatedCode(console);

        return !!_isValid;
      }
    };
  }
}());
