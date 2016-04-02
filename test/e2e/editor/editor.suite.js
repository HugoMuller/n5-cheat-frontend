'use strict';

const cheatTests = require('./cheat.test.js');
const editorTests = require('./editor.test.js');
const completeTests = require('./complete.test.js');

describe('Editor', () => {
  describe('navigation', () => {
    it('should land on editor page', editorTests.init);
  });

  describe('game information', () => {
    it('should set the game title', editorTests.setGameTitle);
    it('should set the version CRC', editorTests.setVersionCrc);
    it('should set the version title', editorTests.setVersionTitle);
  });

  describe('cheats', () => {
    it('should add one cheat', cheatTests.addOneCheat);
    it('should remove one cheat', cheatTests.removeOneCheat);
    it('should add several cheats', cheatTests.addCheats);
    it('should remove several cheats', cheatTests.removeCheats);
  });

  describe('well formed xml', () => {
    it('should meet all requirements', completeTests.completeXml);
  });
});
