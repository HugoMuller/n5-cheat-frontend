(function(){
  'use strict';

  angular
    .module('n5cheat')
    .config(configuration);

  //////////////////////////////////////////////////////////////////////////////

  configuration.$inject = ['$routeProvider', '$compileProvider', 'ENV'];

  function configuration($routeProvider, $compileProvider, ENV){
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html'
      })
      .when('/editor', {
        templateUrl: 'views/editor.html'
      })
      .otherwise({
        redirectTo: '/'
      });

    $compileProvider.debugInfoEnabled(!!ENV.debug);
  }
}());
