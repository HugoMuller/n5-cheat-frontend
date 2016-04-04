(function(){
  'use strict';

  angular
    .module('n5cheat.navbar')
    .component('navbar', {
      templateUrl: 'scripts/navbar/navbar.html',
      controller: 'NavbarCtrl as vm',
      bindings: {}
    });
}());
