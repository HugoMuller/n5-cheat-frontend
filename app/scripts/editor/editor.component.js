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

  EditorCtrl.$inject = ['$scope', '$compile', 'cheatService', 'validCheatsFilter', 'ENV'];

  function EditorCtrl($scope, $compile, cheatService, validCheatsFilter, ENV){
    const vm = this;

    vm.addCheat = addCheat;
    vm.removeCheat = removeCheat;
    vm.countCheats = countCheats;
    vm.getAvailableFormats = getAvailableFormats;
    vm.showXml = showXml;
    vm.hasGameTitle = hasGameTitle;
    vm.hasVersionCrc = hasVersionCrc;
    vm.hasVersionTitle = hasVersionTitle;

    init();

    ///////////////////////////////////////////////////////////////////////////

    function addCheat(){
      const id = vm.content.cheats.length;
      vm.content.cheats.push(cheatService(vm.content.cheats));

      const elem = `<cheat id="cheat-${id}"
        cheat="vm.content.cheats[${id}]"
        formats="vm.availableFormats"
        remove-cheat="vm.removeCheat(${id})"></cheat>`;
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

    function getAvailableFormats(){
      vm.availableFormats = ENV.codeFormats[vm.content.console];
    }

    function showXml(){
      return vm.hasGameTitle() && vm.hasVersionCrc() && vm.hasVersionTitle() && vm.countCheats() > 0;
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

    ///////////////////////////////////////////////////////////////////////////

    function init(){
      vm.consoles = ENV.consoles;

      vm.content = {
        game: {
          title: ''
        },
        cheats: [],
        console: ENV.defaults.console,
        version: {
          crc: '',
          codeCount: 0,
          title: ''
        },
      };

      getAvailableFormats();
    }
  }
})();
