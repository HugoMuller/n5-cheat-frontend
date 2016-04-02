'use strict';

module.exports = {
  getEditorLeft,
  getInputGameTitle,
  getInputVersionCrc,
  getInputVersionTitle,
  getCheatsContainer,
  getMoreCheatsButton,

  getCheatElementList,
  getCheatElement,
  getCheatFormat,
  getCheatHacker,
  getCheatName,
  getCheatCode,
  getCheatRemoveButton,

  getEditorRight,
  getXmlInfoErrorContainer,
  getXmlInfoErrorList,
  getXmlInfoSuccessContainer,

  getXmlCompiledContainer,
  getXmlGameTitle,
  getXmlVersionCrc,
  getXmlCheatCount,
  getXmlVersionTitle,
  getXmlCheatLines,
  getXmlCheatLine
};

///////////////////////////////////////////////////////////////////////////
// left editor
function getEditorLeft(){
  return browser.element(by.css('div.editor-left'));
}

function getInputGameTitle(){
  return getEditorLeft().element(by.model('vm.game.title'));
}

function getInputVersionCrc(){
  return getEditorLeft().element(by.model('vm.version.crc'));
}

function getInputVersionTitle(){
  return getEditorLeft().element(by.model('vm.version.title'));
}

function getCheatsContainer(){
  return getEditorLeft().element(by.css('div#cheats-container'));
}

function getMoreCheatsButton(){
  return getEditorLeft().element(by.css('div.more-cheats-container > a'));
}

///////////////////////////////////////////////////////////////////////////
// cheats

function getCheatElementList(){
  return getCheatsContainer().all(by.css('div[cheat]'));
}

function getCheatElement(id){
  return getCheatElementList().get(id);
}

function getCheatFormat(id){
  return getCheatElement(id).element(by.model('cheat.format'));
}

function getCheatHacker(id){
  return getCheatElement(id).element(by.model('cheat.hacker'));
}

function getCheatName(id){
  return getCheatElement(id).element(by.model('cheat.name'));
}

function getCheatCode(id){
  return getCheatElement(id).element(by.model('cheat.code'));
}

function getCheatRemoveButton(id){
  return getCheatElement(id).element(by.css('a.btn.btn-remove'));
}

///////////////////////////////////////////////////////////////////////////
// right editor
function getEditorRight(){
  return browser.element(by.css('div.editor-right'));
}

function getXmlInfoErrorContainer(){
  return getEditorRight().element(by.css('div.xml-info.xml-info-error'));
}

function getXmlInfoErrorList(){
  return getXmlInfoErrorContainer().all(by.css('ul > li'));
}

function getXmlInfoSuccessContainer(){
  return getEditorRight().element(by.css('div.xml-info.xml-info-success'));
}

///////////////////////////////////////////////////////////////////////////
// xml
function getXmlCompiledContainer(){
  return getEditorRight().element(by.css('div.xml-editor.fieldset-content'));
}

function getXmlGameTitle(){
  return getXmlCompiledContainer().element(by.binding('vm.game.title'));
}

function getXmlVersionCrc(){
  return getXmlCompiledContainer().element(by.binding('vm.version.crc.toUpperCase()'));
}

function getXmlCheatCount(){
  return getXmlCompiledContainer().element(by.binding('vm.countCheats()'));
}

function getXmlVersionTitle(){
  return getXmlCompiledContainer().element(by.binding('vm.version.title'));
}

function getXmlCheatLines(){
  return getXmlCompiledContainer().all(by.repeater('cheat in vm.cheats | validCheats'));
}

function getXmlCheatLine(id){
  return getXmlCheatLines().row(id);
}
