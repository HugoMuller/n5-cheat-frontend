'use strict';

module.exports = {
  getEditorLeft,
  getDdlConsole,
  getInputGameTitle,
  getInputVersionCrc,
  getInputVersionTitle,
  getCheatsContainer,
  getMoreCheatsButton,

  getCheatElementList,
  getCheatElement,
  getCheatElementLegend,
  getCheatFormat,
  getCheatHacker,
  getCheatName,
  getCheatCode,
  getCheatElementWrapper,
  getCheatRemoveButton,

  getEditorRight,
  getXmlInfoErrorContainer,
  getXmlInfoErrorListContainer,
  getXmlInfoErrorList,
  getXmlInfoErrorHeaders,
  getXmlInfoErrorButton,

  getXmlCompiledContainer,
  getXmlGameTitle,
  getXmlVersionCrc,
  getXmlCheatCount,
  getXmlVersionTitle,
  getXmlCheatLines,
  getXmlCheatLine,
  getXmlCheatWrapper
};

///////////////////////////////////////////////////////////////////////////
// left editor
function getEditorLeft(){
  return browser.$('div.editor-left');
}

function getDdlConsole(){
  return ddl('vm.content.console', getEditorLeft());
}

function getInputGameTitle(){
  return getEditorLeft().element(by.model('vm.content.game.title'));
}

function getInputVersionCrc(){
  return getEditorLeft().element(by.model('vm.content.version.crc'));
}

function getInputVersionTitle(){
  return getEditorLeft().element(by.model('vm.content.version.title'));
}

function getCheatsContainer(){
  return getEditorLeft().$('div#cheats-container');
}

function getMoreCheatsButton(){
  return getEditorLeft().$('div.more-cheats-container > a');
}

///////////////////////////////////////////////////////////////////////////
// cheats

function getCheatElementList(){
  return getCheatsContainer().$$('cheat');
}

function getCheatElement(id){
  return getCheatElementList().get(id);
}

function getCheatElementLegend(id){
  return getCheatElement(id).$('div.fieldset-legend');
}

function getCheatFormat(id){
  return getCheatElement(id).element(by.model('vm.cheat.format'));
}

function getCheatHacker(id){
  return getCheatElement(id).element(by.model('vm.cheat.hacker'));
}

function getCheatName(id){
  return getCheatElement(id).element(by.model('vm.cheat.name'));
}

function getCheatCode(id){
  return getCheatElement(id).element(by.model('vm.cheat.code'));
}

function getCheatElementWrapper(id){
  const wrapper = {};

  wrapper.element = getCheatElement(id);
  wrapper.name = attr('vm.cheat.name', wrapper, wrapper.element);
  wrapper.hacker = attr('vm.cheat.hacker', wrapper, wrapper.element);
  wrapper.format = ddl('vm.cheat.format', wrapper, wrapper.element);
  wrapper.code = attr('vm.cheat.code', wrapper, wrapper.element);
  wrapper.placeHolder = placeHolder('vm.cheat.code', wrapper.element);

  return wrapper;
}

function getCheatRemoveButton(id){
  return getCheatElement(id).$('a.btn.btn-remove');
}

///////////////////////////////////////////////////////////////////////////
// right editor
function getEditorRight(){
  return browser.$('div.editor-right');
}

function getXmlInfoErrorContainer(){
  return getEditorRight().$('error-list');
}

function getXmlInfoErrorListContainer(){
  return getXmlInfoErrorContainer().$('ul');
}

function getXmlInfoErrorList(){
  return getXmlInfoErrorContainer().$$('ul > li:not(.dropdown-header)');
}

function getXmlInfoErrorHeaders(){
  return getXmlInfoErrorContainer().$$('ul > li.dropdown-header');
}

function getXmlInfoErrorButton(){
  return getXmlInfoErrorContainer().$$('.el-btn').first();
}

///////////////////////////////////////////////////////////////////////////
// xml
function getXmlCompiledContainer(){
  return getEditorRight().$('xml-code.xml-editor.fieldset-content');
}

function getXmlGameTitle(){
  return getXmlCompiledContainer().element(by.exactBinding('vm.content.game.title'));
}

function getXmlVersionCrc(){
  return getXmlCompiledContainer().element(by.exactBinding('vm.content.version.crc.toUpperCase()'));
}

function getXmlCheatCount(){
  return getXmlCompiledContainer().element(by.exactBinding('vm.countCheats()'));
}

function getXmlVersionTitle(){
  return getXmlCompiledContainer().element(by.exactBinding('vm.content.version.title'));
}

function getXmlCheatLines(){
  return getXmlCompiledContainer().all(by.repeater('cheat in vm.content.cheats | validCheats'));
}

function getXmlCheatLine(id){
  return getXmlCompiledContainer().element(by.repeater('cheat in vm.content.cheats | validCheats').row(id));
}

function getXmlCheatWrapper(id){
  const wrapper = {
    element: getXmlCheatLine(id),
    name: xmlAttr('cheat.name'),
    hacker: xmlAttr("cheat.hacker || 'Unknown'"),
    format: xmlAttr('cheat.format'),
    code: xmlAttr('cheat.code | formatCode:cheat.format:vm.content.console')
  };

  return wrapper;

  //////////////////////////////////

  function xmlAttr(binding){
    return () => wrapper.element.element(by.exactBinding(`${binding}`)).getText();
  }
}

function attr(model, context, elementContext){
  elementContext = elementContext || context;

  return (value) => {
    const input = elementContext.element(by.model(`${model}`));
    if(value !== null && value !== undefined){
      input.clear().sendKeys(value);
      return context;
    }
    return input.getAttribute('value');
  };
}

function ddl(model, context, elementContext){
  elementContext = elementContext || context;

  return (value) => {
    const input = elementContext.element(by.model(`${model}`));
    if(value !== null && value !== undefined){
      input.$(`option[label="${value}"]`).click();
      return context;
    }
    return input.$('option:checked').getText();
  };
}

function placeHolder(model, context){
  return () => context
    .element(by.model(`${model}`))
    .getAttribute('placeholder');
}
