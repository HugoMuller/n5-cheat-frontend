(function(){
  'use strict';

  angular
    .module('n5cheat.xmlCode')
    .directive('xmlCode', xmlCode);

  xmlCode.$inject = [];

  function xmlCode(){
    return {
      restrict: 'A',
      templateUrl: 'scripts/xml-code/xml-code.html',
      scope: false
    };
  }
})();
