'use strict';

const conf = require('./ci-protractor.conf').config;
conf.capabilities.browserName = 'firefox';

exports.config = conf;
