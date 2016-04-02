'use strict';

const tests = require('./redirection.test.js');

describe('Redirction', () => {
  it('should navigate to "/"', tests.rootTest);
  it('should redirect to "/" if route is unknown',tests. redirectTest);
});
