'use strict';

const jasmineReporters = require('jasmine-reporters');
const HtmlScreenshotReporter = require('protractor-jasmine2-screenshot-reporter');

exports.config = {
  allScriptsTimeout: 60000,

  specs: [
    '../**/*suite.js'
  ],

  capabilities: {
    browserName: 'chrome'

    /* DOES NOT WORK, phantomjs crashes
    'browserName': 'phantomjs',

    // Can be used to specify the phantomjs binary path.
    // This can generally be ommitted if you installed phantomjs globally.
    'phantomjs.binary.path': require('phantomjs').path,


    // Command line args to pass to ghostdriver, phantomjs's browser driver.
    // See https://github.com/detro/ghostdriver#faq
    'phantomjs.ghostdriver.cli.args': ['--loglevel=DEBUG']
    */
  },

  baseUrl: 'http://localhost:9000',

  framework: 'jasmine2',

  jasmineNodeOpts: {
    defaultTimeoutInterval: 600000,
    realtimeFailure: true
  },

  onPrepare
};

function onPrepare(){
  configureWindow();
  configureReporter();
  addBrowserName();
}

function configureWindow() {
  //Set window size and position
  browser
    .driver
    .manage()
    .window()
    .setSize(1024, 768);
}

function configureReporter(){
  const terminalReporter = new jasmineReporters.TerminalReporter({
    verbosity: 3,
    color: true,
    showStack: true
  });

  const screenshotReporter = new HtmlScreenshotReporter({
    dest: 'reports/screenshots',
    captureOnlyFailedSpecs: true,
    reportOnlyFailedSpecs: false
  });

  const env = jasmine.getEnv();

  env.addReporter(terminalReporter);
  env.addReporter(screenshotReporter);
}

function addBrowserName(){
  browser
    .getCapabilities()
    .then((capabilities) => {
      browser.browserName = capabilities.get('browserName').toLowerCase();
    });
}
