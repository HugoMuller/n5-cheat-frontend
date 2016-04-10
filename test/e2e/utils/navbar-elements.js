'use strict';

module.exports = {
  getNavbar,
  getBrandTab,
  getHomeTab,
  getEditorTab
};

///////////////////////////////////////////////////////////////////////////

function getNavbar(){
  return browser.$('div.header');
}

function getBrandTab(){
  return getNavbar().$('div.navbar-header a.navbar-brand');
}

function getHomeTab(){
  return getTab('home-tab');
}

function getEditorTab(){
  return getTab('editor-tab');
}

///////////////////////////////////////////////////////////////////////////

function getTab(tab){
  return getNavbar().$(`div.collapse.navbar-collapse ul.nav li.${tab}`);
}
