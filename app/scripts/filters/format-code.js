(function(){
  'use strict';

  angular
    .module('n5cheat.filters')
    .filter('formatCode', formatCode);

  formatCode.$inject = ['ENV'];

  function formatCode(ENV){
    return function(code, format){
      code = code || '';

      let tokens;
      const res = code
        .replace(/[^A-Fa-f0-9]/g, '')
        .toUpperCase();

      if(format === ENV.codeFormat.GameShark){
        tokens = res.match(/.{8}/g) || [];
      }else if(format === ENV.codeFormat.GameGenie){
        tokens = [];
        (res.match(/.{6}/g) || []).forEach((token) => {
          tokens.push(token.match(/.{2,4}/g).join(':'));
        });
      }else{
        return res;
      }

      return tokens.join(',');
    };
  }
})();
