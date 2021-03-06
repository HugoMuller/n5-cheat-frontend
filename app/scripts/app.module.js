(function(){
  'use strict';

  angular.module('n5cheat', [
    'ngRoute',
    'n5cheat.home',
    'n5cheat.filters',
    'n5cheat.modal',
    'n5cheat.cheat',
    'n5cheat.editor',
    'n5cheat.errorList',
    'n5cheat.xmlCode',
    'n5cheat.navbar'
  ]);

  angular.module('n5cheat.home', []);
  angular.module('n5cheat.filters', []);
  angular.module('n5cheat.modal', ['ui.bootstrap']);
  angular.module('n5cheat.cheat', []);
  angular.module('n5cheat.xmlCode', []);
  angular.module('n5cheat.errorList', []);
  angular.module('n5cheat.editor', []);
  angular.module('n5cheat.navbar', []);
}());
