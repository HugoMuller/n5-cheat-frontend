(function(){
  'use strict';

  angular.module('n5cheat', [
    'ngRoute',
    'n5cheat.filters',
    'n5cheat.cheat',
    'n5cheat.editor',
    'n5cheat.xmlCode'
  ]);

  angular.module('n5cheat.filters', []);
  angular.module('n5cheat.cheat', []);
  angular.module('n5cheat.xmlCode', []);
  angular.module('n5cheat.editor', []);
})();
