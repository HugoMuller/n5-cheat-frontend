'use strict';

const tests = require('./editor.test.js');

describe('Editor', () => {
  it('should land on editor page', tests.initTest);
  it('should set the game title', tests.setGameTitle);
  it('should set the version CRC', tests.setVersionCrc);
  it('should set the version title', tests.setVersionTitle);
});
