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

  NavbarCtrl.$inject = ['$location'];

  function NavbarCtrl($location){
    const vm = this;

    vm.isHomeActive = isHomeActive;
    vm.isEditorActive = isEditorActive;

    function isHomeActive(){
      return $location.path() === '/';
    }

    function isEditorActive(){
      return $location.path() === '/editor';
    }
  }
}());
