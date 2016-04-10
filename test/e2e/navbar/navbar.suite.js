'use strict';

const navbarTests = require('./navbar.test.js');

describe('Navbar', () => {
  describe('navigation', () => {
    it('should land on home page', navbarTests.homePage);
    it('should land on editor page', navbarTests.editorPage);
  });
});
