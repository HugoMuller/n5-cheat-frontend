(function(){
  'use strict';

  angular
    .module('n5cheat.cheat')
    .factory('cheatService', cheatService);

  const uniqueId = (function(){
    let uid = 0;
    return function(){
      return uid++;
    };
  })();

  cheatService.$inject = [];

  function cheatService(){
    return function(cheats){
      const that = {};

      that.id = uniqueId();
      that.format = '';
      that.hacker = '';
      that.name = '';
      that.code = '';

      that.computeCheatId = computeCheatIdFromCheats(cheats);
      that.formattedCode = formattedCode;

      return that;

      ///////////////////////////////////////////////////////////////////////////

      function computeCheatIdFromCheats(cheats){
        return function(){
          const id = that.id;
          let _id = 0;

          cheats.some((cheat) => {
            if(!cheat) return false;
            _id++;
            return cheat.id === id;
          });

          return _id;
        };
      }

      function formattedCode(){
        const res = (that.code || '')
          .replace(/\r\n|\r|\n/g, ',')
          .replace(/[^A-Fa-f0-9:,]/g, '')
          .toUpperCase();

        return res;
      }
    };
  }
})();
