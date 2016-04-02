'use strict';

const conf = require('./ci-protractor.conf').config;
conf.capabilities.browserName = 'chrome';

exports.config = conf;
