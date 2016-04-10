(function(){
  'use strict';

  angular
    .module('n5cheat.filters')
    .filter('formatCode', formatCode);

  formatCode.$inject = ['ENV'];

  function formatCode(ENV){
    return function(code, format, console){
      code = (code || '')
        .replace(/[^A-Fa-f0-9]/g, '')
        .toUpperCase();

      const formatInfo = _.find(ENV.codeFormats[console], { format });
      if(!formatInfo) return '';

      return genericFormatter(code, formatInfo.tokens[0], formatInfo.tokens[1]);
    };
  }

  ///////////////////////////////////////////////////////////////////////////

  function genericFormatter(code, length, remainder = 0){
    const toks = code.match(new RegExp(`.{${length+remainder}}`, 'g')) || [];
    let tokens;

    if(remainder > 0){
      tokens = [];
      toks.forEach((token) => {
        tokens.push(
          token
            .match(new RegExp(`.{${remainder},${length}}`, 'g'))
            .join(':')
        );
      });
    }else{
      tokens = toks;
    }

    return tokens.join(',');
  }
})();
