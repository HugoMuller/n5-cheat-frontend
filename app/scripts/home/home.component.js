(function(){
  'use strict';

  angular
    .module('n5cheat.home')
    .controller('HomeCtrl', HomeCtrl)
    .component('home', {
      templateUrl: 'scripts/home/home.html',
      controller: 'HomeCtrl as vm',
      bindings: {}
    });

  //////////////////////////////////////////////////////////////////////////////

  HomeCtrl.$inject = [];

  function HomeCtrl(){}
}());
