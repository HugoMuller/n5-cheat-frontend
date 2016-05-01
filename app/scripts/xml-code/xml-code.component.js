(function(){
  'use strict';

  angular
    .module('n5cheat.xmlCode')
    .controller('XmlCodeCtrl', XmlCodeCtrl)
    .component('xmlCode', {
      templateUrl: 'scripts/xml-code/xml-code.html',
      controller: 'XmlCodeCtrl as vm',
      bindings: {
        content: '=',
        countCheats: '&'
      }
    });

  //////////////////////////////////////////////////////////////////////////////

  XmlCodeCtrl.$inject = [];

  function XmlCodeCtrl(){}
}());
