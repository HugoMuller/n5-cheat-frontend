'use strict';

const _ = require('lodash');

module.exports = function(overrides){
  return function(config) {
    const base = {
      // enable / disable watching file and executing tests whenever any file changes
      autoWatch: true,

      // base path, that will be used to resolve files and exclude
      basePath: '../../../',

      // testing framework to use (jasmine/mocha/qunit/...)
      // as well as any additional frameworks (requirejs/chai/sinon/...)
      frameworks: ["jasmine", "sinon"],

      // list of files / patterns to load in the browser
      files: [
        'bower_components/angular/angular.js',
        'bower_components/angular-cookies/angular-cookies.js',
        'bower_components/angular-messages/angular-messages.js',
        'bower_components/angular-route/angular-route.js',
        'bower_components/angular-sanitize/angular-sanitize.js',
        'bower_components/lodash/dist/lodash.js',
        'bower_components/angular-mocks/angular-mocks.js',

        'app/scripts/app.module.js',
        'app/scripts/app.js',
        'app/config/env.js',
        'app/scripts/**/*.js',
        'app/scripts/**/*.html',
        'test/unit/**/*.js',
      ],

      preprocessors: {
        'app/**/*.js': ['babel'],
        'test/**/*.js': ['babel'],
        'app/scripts/**/*.html': ['ng-html2js'],
      },

      // list of files / patterns to exclude
      exclude: [
        'test/unit/config/*',
        'app/bower_components/**/*'
      ],

      // web server port
      port: 9876,

      // Start these browsers, currently available:
      // - Chrome
      // - ChromeCanary
      // - Firefox
      // - Opera
      // - Safari (only Mac)
      // - PhantomJS
      // - IE (only Windows)
      browsers: [
        //"PhantomJS",
        "Chrome"
      ],

      reporters : ['spec'],

      // Which plugins to enable
      plugins: [
        //"karma-phantomjs-launcher",
        "karma-chrome-launcher",
        "karma-jasmine",
        "karma-sinon",
        "karma-spec-reporter",
        "karma-babel-preprocessor",
        'karma-ng-html2js-preprocessor',
      ],

      // Continuous Integration mode
      // if true, it capture browsers, run tests and exit
      singleRun: false,

      colors: true,

      // level of logging
      // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
      logLevel: config.LOG_INFO,

      // Uncomment the following lines if you are using grunt's server to run the tests
      // proxies: {
      //   '/': 'http://localhost:9000/'
      // },
      // URL root prevent conflicts with the site root
      // urlRoot: '_karma_'

      babelPreprocessor: {
        options: {
          presets: ['es2015'],
          sourceMap: 'inline',
        },
        filename: file => file.originalPath.replace(/\.js$/, '.es5.js'),
        sourceFileName: file => file.originalPath,
      },

      ngHtml2JsPreprocessor: {
        cacheIdFromPath : (filepath) => filepath.substr('app/'.length),
        moduleName: 'templates'
      }
    };

    config.set(_.assignInWith({}, base, overrides, concatArrays));
  };
};

function concatArrays(value, other){
  if (Array.isArray(value) && Array.isArray(other)){
    return value.concat(other);
  }

  return other;
}
