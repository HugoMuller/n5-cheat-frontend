(function(){
  'use strict';

  angular
    .module('n5cheat')
    .config(configuration);

  configuration.$inject = ['$routeProvider'];

  function configuration($routeProvider){
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html'
      })
      .otherwise({
        redirectTo: '/'
      });
  }
})();
