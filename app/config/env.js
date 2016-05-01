(function(){
  'use strict';

  angular
    .module('n5cheat')
    .constant('ENV', {
      consoles: {
        gameboy: 'Game Boy',
        gba: 'Game Boy Advance',
        nes: 'NES',
        snes: 'SNES',
        genesis: 'Genesis',
        sms: 'Sega Master System'
      },
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
      defaults: {
        console: 'gameboy'
      },
      maxCheatErrorsDisplayed: 3,
      anchors: {
        bottom: 'btn-add-cheat',
        up: ''
      }
    });
}());
