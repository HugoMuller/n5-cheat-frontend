'use strict';

module.exports = {
  expectCheat
};

function expectCheat(cheat){
  return {
    toHave
  };

  function toHave(name, hacker, format, code){
    expect(cheat.element.isPresent()).toBe(true);
    expect(cheat.name()).toBe(name);
    expect(cheat.hacker()).toBe(hacker);
    expect(cheat.format()).toBe(format);
    expect(cheat.code()).toBe(code);
  }
}
