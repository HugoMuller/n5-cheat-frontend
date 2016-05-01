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
      if(!angular.isNumber(limit) || !isFinite(limit)) return obj;

      const keys = Object.keys(obj).sort();
      const result = {};

      if(limit > keys.length){
        limit = keys.length;
      }else if(-limit > keys.length){
        limit = -keys.length;
      }

      if(limit < 0){
        keys.reverse();
        limit = -limit;
      }

      keys.every((key, i) => {
        if(i >= limit) return false;

        result[key] = obj[key];
        return true;
      });

      return result;
    };
  }
}());
