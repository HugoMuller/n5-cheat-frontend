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

  EditorCtrl.$inject = ['$scope', '$compile', '$anchorScroll', '$timeout', 'cheatService', 'validCheatsFilter', 'ENV'];

  function EditorCtrl($scope, $compile, $anchorScroll, $timeout, cheatService, validCheatsFilter, ENV){
    const vm = this;

    vm.addCheat = addCheat;
    vm.removeCheat = removeCheat;
    vm.countCheats = countCheats;
    vm.getAvailableFormats = getAvailableFormats;
    vm.showXml = showXml;
    vm.hasGameTitle = hasGameTitle;
    vm.hasVersionCrc = hasVersionCrc;
    vm.hasVersionTitle = hasVersionTitle;
    //triggers
    vm.onGameTitleChanges = onGameTitleChanges;
    vm.onVersionCrcChanges = onVersionCrcChanges;
    vm.onVersionTitleChanges = onVersionTitleChanges;

    init();

    ///////////////////////////////////////////////////////////////////////////

    function addCheat(){
      const id = vm.content.cheats.length;
      const cheat = cheatService(vm.content.cheats);
      vm.content.cheats.push(cheat);

      const elem = `<cheat id="cheat-${id}"
        cheat="vm.content.cheats[${id}]"
        formats="vm.availableFormats"
        remove-cheat="vm.removeCheat(${id})"></cheat>`;
      const cheatElem = $compile(angular.element(elem))($scope);

      angular
        .element(document.getElementById('cheats-container'))
        .append(cheatElem);

      onAddCheat(id, cheat);
      $timeout(() => $anchorScroll(ENV.anchors.bottom));
    }

    function removeCheat(id){
      angular
        .element(document.getElementById(`cheat-${id}`))
        .remove();

      delete vm.content.cheats[id];
      onRemoveCheat(id);
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
      vm.errorList = { game: {}, cheat: {} };
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
      setNoCheatError();
    }

    ///////////////////////////////////////////////////////////////////////////
    // Triggers

    function onGameTitleChanges(){
      if(hasGameTitle()){
        delete vm.errorList.game.gameTitle;
      }else{
        vm.errorList.game.gameTitle = {
          message: () => 'Invalid game title',
          action: () => document.getElementById('game-title').focus()
        };
      }
    }

    function onVersionCrcChanges(){
      if(hasVersionCrc()){
        delete vm.errorList.game.versionCrc;
      }else{
        vm.errorList.game.versionCrc = {
          message: () => 'Invalid version CRC',
          action: () => document.getElementById('version-crc').focus()
        };
      }
    }

    function onVersionTitleChanges(){
      if(hasVersionCrc()){
        delete vm.errorList.game.versionTitle;
      }else{
        vm.errorList.game.versionTitle = {
          message: () => 'Invalid version title',
          action: () => document.getElementById('version-title').focus()
        };
      }
    }

    function onAddCheat(id, cheat){
      delete vm.errorList.cheat.noCheat;
      vm.errorList.cheat[id] = { message, action };

      function message(){
        let error;

        if(!cheat.format){
          error = 'no format';
        }else if(!cheat.name){
          error = 'no name';
        }else if(!cheat.sanitizedCode()){
          error = 'invalid code';
        }

        return `Cheat #${cheat.computeCheatId()} has ${error}`;
      }

      function action(){
        let selector = `#cheat-${id} `;

        if(!cheat.format){
          selector += 'select.cheat-format';
        }else if(!cheat.name){
          selector += 'input.cheat-name';
        }else if(!cheat.sanitizedCode()){
          selector += 'textarea.cheat-code';
        }

        document.querySelector(selector).focus();
      }
    }

    function onRemoveCheat(id){
      delete vm.errorList.cheat[id];

      if(document.querySelectorAll('cheat').length === 0){
        vm.content.cheats.length = 0;
        setNoCheatError();
      }
    }

    function setNoCheatError(){
      vm.errorList.cheat = {
        noCheat: {
          message: () => 'No cheat code',
          action: () => document.getElementById('btn-add-cheat').focus()
        }
      };
    }
  }
}());
