const path = require('path');
const webpackConfig = require('./webpack.config');

module.exports = function(config) {
    config.set({
        // base path, that will be used to resolve files and exclude
        basePath: '',

        // frameworks to use
        frameworks: [ 'mocha', 'sinon-chai' ],

        // list of files to load in the browser
        files: [
            {
                pattern: 'test/test-context.js',
                watched: true
            }
        ],

        // list of files to exclude
        exclude: [],

        // process es6 files
        preprocessors: {
            'test/test-context.js': [ 'webpack', 'sourcemap' ]
        },

        coverageReporter: {
            dir: 'coverage',
            includeAllSources: true,
            reporters: [
                {type:'text'},
                {type: 'html'}
            ]
        },

        // webpack
        webpack: webpackConfig,

        webpackServer: {
            noInfo: true
        },

        // chai config
        client: {
            chai: {
                includeStack: true
            }
        },

        // test results reporter (options: 'dots', 'progress', 'junit', 'growl', 'coverage')
        reporters: [ 'progress', 'coverage' ],

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging (options: LOG_DISABLE, LOG_ERROR, LOG_WARN, LOG_INFO, LOG_DEBUG)
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // browsers ('Chrome', 'ChromeCanary', 'Firefox', 'Opera', 'Safari', 'PhantomJS', 'IE')
        browsers: [ 'Chrome' ],

        customLaunchers: {
            Chrome_with_debugging: {
                base: 'Chrome',
                chromeDataDir: path.resolve(__dirname, '.chrome')
            }
        },

        // if browser does not capture in given timeout [ms], kill it
        captureTimeout: 60000
    });
};
