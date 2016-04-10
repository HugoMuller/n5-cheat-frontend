'use strict';

const elements = require('../utils/navbar-elements.js');

module.exports = {
  homePage,
  editorPage
};

///////////////////////////////////////////////////////////////////////////

function homePage(){
  browser.get('/');

  expect(elements.getHomeTab().getAttribute('class')).toMatch(/active/);
  expect(elements.getEditorTab().getAttribute('class')).not.toMatch(/active/);
}

///////////////////////////////////////////////////////////////////////////

function editorPage(){
  browser.get('#/editor');

  expect(elements.getHomeTab().getAttribute('class')).not.toMatch(/active/);
  expect(elements.getEditorTab().getAttribute('class')).toMatch(/active/);
}
