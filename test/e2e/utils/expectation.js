'use strict';

module.exports = {
  expectCheat,
  toContainSeveral: containSeveral(true),
  not: {
    toContainSeveral: containSeveral(false)
  }
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

function containSeveral(to){
  return (arr, items) => {
    const expectation = to ? expect(arr) : expect(arr).not;
    items = Array.isArray(items) ? items : [items];

    items.forEach((item) => expectation.toContain(item));
  };
}
