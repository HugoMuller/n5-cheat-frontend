(function(){
  'use strict';

  angular
    .module('n5cheat.filters')
    .filter('objLimitTo', objLimitTo);

  //////////////////////////////////////////////////////////////////////////////

  objLimitTo.$inject = [];

  // Mimic angular's built-in limitTo and apply it to objects.
  function objLimitTo(){
    return (obj, limit) => {
      const keys = Object.keys(obj).sort();
      const result = {};

      keys.every((key, i) => {
        if(i >= limit) return false;

        result[key] = obj[key];
        return true;
      });

      return result;
    };
  }
}());
