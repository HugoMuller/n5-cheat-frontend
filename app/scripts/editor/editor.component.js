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

  EditorCtrl.$inject = ['$scope', '$compile', '$anchorScroll', '$timeout', 'cheatFactory', 'validCheatsFilter', 'ENV'];

  function EditorCtrl($scope, $compile, $anchorScroll, $timeout, cheatFactory, validCheatsFilter, ENV){
    let createCheat;
    const vm = this;

    vm.addCheat = addCheat;
    vm.removeCheat = removeCheat;
    vm.countCheats = countCheats;
    vm.getAvailableFormats = getAvailableFormats;
    vm.hasGameTitle = hasGameTitle;
    vm.hasVersionCrc = hasVersionCrc;
    vm.hasVersionTitle = hasVersionTitle;
    vm.getCheatById = getCheatById;
    //triggers
    vm.onGameTitleChanges = onGameTitleChanges;
    vm.onVersionCrcChanges = onVersionCrcChanges;
    vm.onVersionTitleChanges = onVersionTitleChanges;
    vm.onAddCheat = onAddCheat;

    init();

    ///////////////////////////////////////////////////////////////////////////

    function addCheat(){
      const cheat = createCheat();
      const id = cheat.id;
      vm.content.cheats.push(cheat);

      const elem = `<cheat id="cheat-${id}"
        cheat="vm.getCheatById(${id})"
        formats="vm.availableFormats"
        remove-cheat="vm.removeCheat(${id})"
        manage-error="vm.onAddCheat(${id}, cheat)"></cheat>`;
      const cheatElem = $compile(angular.element(elem))($scope);

      angular
        .element(document.getElementById('cheats-container'))
        .append(cheatElem);

      vm.onAddCheat(id, cheat);
      $timeout(() => $anchorScroll(ENV.anchors.bottom));
    }

    function removeCheat(id){
      angular
        .element(document.getElementById(`cheat-${id}`))
        .remove();

      _.remove(vm.content.cheats, { id });
      onRemoveCheat(id);
    }

    function countCheats(){
      return validCheatsFilter(vm.content.cheats, vm.content.console).length;
    }

    function getAvailableFormats(){
      vm.availableFormats = ENV.codeFormats[vm.content.console];
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

    function getCheatById(id){
      return _.find(vm.content.cheats, { id });
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

      createCheat = cheatFactory.create(vm.content.cheats);
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
      if(hasVersionTitle()){
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

      if(cheat.isValid(vm.content.console)){
        return delete vm.errorList.cheat[id];
      }

      vm.errorList.cheat[id] = { message, action };

      function message(){
        const error = grabItem({
          format: 'no format',
          name: 'no name',
          code: 'invalid code'
        });

        return `Cheat #${cheat.computeCheatId()} has ${error}`;
      }

      function action(){
        const selector = grabItem({
          format: `#cheat-${id} select.cheat-format`,
          name: `#cheat-${id} input.cheat-name`,
          code: `#cheat-${id} textarea.cheat-code`
        });

        document.querySelector(selector).focus();
      }

      function grabItem(item){
        if(!cheat.format) return item.format;
        if(!cheat.name) return item.name;

        if(!cheat.formatedCode(vm.content.console)){
          return item.code;
        }
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
