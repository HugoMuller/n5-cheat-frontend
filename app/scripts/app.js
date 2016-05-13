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
        template: '<home></home>'
      })
      .when('/editor', {
        template: '<editor></editor>'
      })
      .otherwise({
        redirectTo: '/'
      });

    $compileProvider.debugInfoEnabled(!!ENV.debug);
  }
}());
