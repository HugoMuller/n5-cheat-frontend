(function(){
  'use strict';

  angular
    .module('n5cheat.editor')
    .controller('EditorCtrl', EditorCtrl)
    .component('editor', {
      templateUrl: 'scripts/editor/editor.html',
      controller: 'EditorCtrl as vm',
      bindings: {}
    });

  //////////////////////////////////////////////////////////////////////////////

  EditorCtrl.$inject = ['$scope', '$compile', 'cheatService', 'ENV', 'validCheatsFilter'];

  function EditorCtrl($scope, $compile, cheatService, ENV, validCheatsFilter){
    const vm = this;

    vm.addCheat = addCheat;
    vm.removeCheat = removeCheat;
    vm.countCheats = countCheats;
    vm.getCodePlaceHolder = getCodePlaceHolder;
    vm.showXml = showXml;
    vm.hasGameTitle = hasGameTitle;
    vm.hasVersionCrc = hasVersionCrc;
    vm.hasVersionTitle = hasVersionTitle;

    init();

    ///////////////////////////////////////////////////////////////////////////

    function addCheat(){
      const id = vm.content.cheats.length;
      vm.content.cheats.push(cheatService(vm.content.cheats));

      const elem = `<cheat cheat="vm.content.cheats[${id}]"
        id="cheat-${id}"
        formats="vm.availableFormats"
        remove-cheat="vm.removeCheat(${id})"
        code-place-holder="vm.getCodePlaceHolder(${id})"></cheat>`;
      const cheatElem = $compile(angular.element(elem))($scope);

      angular
        .element(document.querySelector('#cheats-container'))
        .append(cheatElem);
    }

    function removeCheat(id){
      angular
        .element(document.querySelector(`#cheat-${id}`))
        .remove();
      delete vm.content.cheats[id];
    }

    function countCheats(){
      return validCheatsFilter(vm.content.cheats).length;
    }

    function getCodePlaceHolder(id){
      const cheat = vm.content.cheats[id];
      return cheat ? vm.codePlaceHolders[cheat.format] : '';
    }

    function showXml(){
      return vm.hasGameTitle() && vm.hasVersionCrc() && vm.hasVersionTitle() && vm.countCheats() > 0;
    }

    ///////////////////////////////////////////////////////////////////////////

    function init(){
      vm.availableFormats = [ENV.codeFormat.GameShark, ENV.codeFormat.GameGenie];
      vm.codePlaceHolders = {
        [ENV.codeFormat.GameShark]: '0123ABCD',
        [ENV.codeFormat.GameGenie]: '0123:AB'
      };
      vm.content = {
        game: {
          title: ''
        },
        version: {
          crc: '',
          codeCount: 0,
          title: ''
        },
        cheats: []
      };
    }

    function hasGameTitle(){
      return !!vm.content.game.title;
    }

    function hasVersionCrc(){
      return /^[a-fA-F0-9]{8}$/.test(vm.content.version.crc);
    }

    function hasVersionTitle(){
      return !!vm.content.version.title;
    }
  }
})();
