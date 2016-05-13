(function(){
  'use strict';

  angular
    .module('n5cheat')
    .constant('ENV', {
      // list of available consoles
      consoles: {
        gameboy: 'Game Boy',
        gba: 'Game Boy Advance',
        nes: 'NES',
        snes: 'SNES',
        genesis: 'Genesis',
        sms: 'Sega Master System'
      },
      // list of available code formats for each console, with their sample codes
      codeFormats: {
        gameboy: [
          {
            format: 'GameShark',
            sample: '0123ABCD',
            tokens: [8]
          }, {
            format: 'Game Genie',
            sample: '0123:AB',
            tokens: [4, 2]
          }
        ],
        gba: [
          {
            format: 'AR12',
            sample: '0123ABCD:0123ABCD',
            tokens: [8, 8]
          }, {
            format: 'AR34',
            sample: '0123ABCD:0123ABCD',
            tokens: [8, 8]
          }, {
            format: 'CB',
            sample: '0123ABCD:0123',
            tokens: [8, 4]
          }
        ],
        genesis: [
          {
            format: 'Game Genie',
            sample: '01234A:0123',
            tokens: [6, 4]
          }
        ],
        nes: [
          {
            format: 'Raw',
            sample: '0123:AB',
            tokens: [4, 2]
          }
        ],
        sms: [
          {
            format: 'Action Replay/GameShark',
            sample: '0123AB:01',
            tokens: [6, 2]
          }
        ],
        snes: [
          {
            format: 'Raw',
            sample: '0123AB:01',
            tokens: [6, 2]
          }
        ]
      },
      // define default values, used in initialization phase
      defaults: {
        console: 'gameboy'
      },
      // max number of errors displayed in the error pannel, for each error type
      maxCheatErrorsDisplayed: 3,
      // define anchors ids, for angular $anchorScroll
      anchors: {
        bottom: 'btn-add-cheat',
        up: ''
      },
      // turn on/off debug mode for $compileProvider
      debug: true
    });
}());
