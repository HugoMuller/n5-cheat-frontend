"use strict";

const karmaConf = require('./karma.conf.js');

const ciConf = {
  preprocessors: {
    // source files, that you wanna generate coverage for
    // do not include tests or libraries
    // (these files will be instrumented by Istanbul)
    'app/scripts/**/*.js': ['coverage', 'babel'],
    'app/**/*.js': ['babel'],
    'test/**/*.js': ['babel'],
    'app/scripts/**/*.html': ['ng-html2js'],
  },

  plugins : ['karma-junit-reporter', 'karma-coverage'],

  reporters : ['coverage', 'junit'],

  coverageReporter: {
    // specify a common output directory
    dir: 'reports/',
    reporters: [
      // reporters not supporting the `file` property
      { type: 'html', subdir: 'coverage-html' },
      // reporters supporting the `file` property, use `subdir` to directly
      // output them in the `dir` directory
      { type: 'cobertura', subdir: '.', file: 'cobertura-coverage.xml' },
    ],
  },

  junitReporter: {
    outputDir: './reports',
    outputFile: 'tests.xml',
    useBrowserName: false,
  },
};

module.exports = karmaConf(ciConf);
