"use strict";

const conf = require('./protractor.conf.js').config;
const JUnitXmlReporter = require('jasmine-reporters').JUnitXmlReporter;

const oldPrepare = conf.onPrepare;
conf.onPrepare = onPrepare;
conf.seleniumAddress = 'http://localhost:4444/wd/hub';

function onPrepare(){
  if(oldPrepare) oldPrepare();

  const jUnitReporter = new JUnitXmlReporter({
    savePath: 'reports',
    filePrefix: 'e2e-tests',
    consolidateAll: true
  });

  jasmine.getEnv().addReporter(jUnitReporter);
}

exports.config = conf;
