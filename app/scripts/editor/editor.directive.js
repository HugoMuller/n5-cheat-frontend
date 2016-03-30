(function(){
  'use strict';

  angular
    .module('n5cheat.editor')
    .controller('EditorCtrl', EditorCtrl)
    .directive('editor', Editor);

  Editor.$inject = [];

  function Editor(){
    return {
      restrict: 'E',
      templateUrl: 'scripts/editor/editor.html',
      scope: true,
      controller: EditorCtrl,
      controllerAs: 'vm'
    };
  }

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
      const id = vm.cheats.length;
      vm.cheats.push(cheatService(vm.cheats));

      const elem = `<div cheat="vm.cheats[${id}]"
        id="cheat-${id}"
        formats="vm.availableFormats"
        removecheat="vm.removeCheat(${id})"
        codeplaceholder="vm.getCodePlaceHolder(${id})"></div>`;
      const cheatElem = $compile(angular.element(elem))($scope);

      angular
        .element(document.querySelector('#cheats-container'))
        .append(cheatElem);
    }

    function removeCheat(id){
      angular
        .element(document.querySelector(`#cheat-${id}`))
        .remove();
      delete vm.cheats[id];
    }

    function countCheats(){
      return validCheatsFilter(vm.cheats).length;
    }

    function getCodePlaceHolder(id){
      const cheat = vm.cheats[id];
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
      vm.game = {
        title: ''
      };
      vm.version = {
        crc: '',
        codeCount: 0,
        title: ''
      };
      vm.cheats = [];
    }

    function hasGameTitle(){
      return !!vm.game.title;
    }

    function hasVersionCrc(){
      return !!vm.version.crc && vm.version.crc.length === 8;
    }

    function hasVersionTitle(){
      return !!vm.version.title;
    }
  }
})();
