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
  getCheatElementLegend,
  getCheatFormat,
  getCheatHacker,
  getCheatName,
  getCheatCode,
  getCheatElementWrapper,
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
  getXmlCheatLine,
  getXmlCheatWrapper
};

///////////////////////////////////////////////////////////////////////////
// left editor
function getEditorLeft(){
  return browser.$('div.editor-left');
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
  const wrapper = {
    element: getCheatElement(id),
    name: attr('name'),
    hacker: attr('hacker'),
    format: ddl('format'),
    code: attr('code')
  };

  return wrapper;

  //////////////////////////////////

  function attr(model){
    return (value) => {
      const input = wrapper.element.element(by.model(`vm.cheat.${model}`));
      if(value !== null && value !== undefined){
        input.clear().sendKeys(value);
        return wrapper;
      }
      return input.getAttribute('value');
    };
  }

  function ddl(model){
    return (value) => {
      const input = wrapper.element.element(by.model(`vm.cheat.${model}`));
      if(value !== null && value !== undefined){
        input.$(`option[label="${value}"]`).click();
        return wrapper;
      }
      return input.$('option:checked').getText();
    };
  }
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
  return getEditorRight().$('div.xml-info.xml-info-error');
}

function getXmlInfoErrorList(){
  return getXmlInfoErrorContainer().$$('ul > li');
}

function getXmlInfoSuccessContainer(){
  return getEditorRight().$('div.xml-info.xml-info-success');
}

///////////////////////////////////////////////////////////////////////////
// xml
function getXmlCompiledContainer(){
  return getEditorRight().$('div.xml-editor.fieldset-content');
}

function getXmlGameTitle(){
  return getXmlCompiledContainer().element(by.exactBinding('vm.game.title'));
}

function getXmlVersionCrc(){
  return getXmlCompiledContainer().element(by.exactBinding('vm.version.crc.toUpperCase()'));
}

function getXmlCheatCount(){
  return getXmlCompiledContainer().element(by.exactBinding('vm.countCheats()'));
}

function getXmlVersionTitle(){
  return getXmlCompiledContainer().element(by.exactBinding('vm.version.title'));
}

function getXmlCheatLines(){
  return getXmlCompiledContainer().all(by.repeater('cheat in vm.cheats | validCheats'));
}

function getXmlCheatLine(id){
  return getXmlCompiledContainer().element(by.repeater('cheat in vm.cheats | validCheats').row(id));
}

function getXmlCheatWrapper(id){
  const wrapper = {
    element: getXmlCheatLine(id),
    name: attr('name'),
    hacker: attr("hacker || 'Unknown'"),
    format: attr('format'),
    code: attr('code | formatCode:cheat.format')
  };

  return wrapper;

  //////////////////////////////////

  function attr(binding){
    return () => wrapper.element.element(by.exactBinding(`cheat.${binding}`)).getText();
  }
}
