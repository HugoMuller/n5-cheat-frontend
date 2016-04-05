(function(){
  'use strict';

  angular
    .module('n5cheat.navbar')
    .controller('NavbarCtrl', NavbarCtrl)
    .component('navbar', {
      templateUrl: 'scripts/navbar/navbar.html',
      controller: 'NavbarCtrl as vm',
      bindings: {}
    });

  NavbarCtrl.$inject = [];

  function NavbarCtrl(){}
}());
