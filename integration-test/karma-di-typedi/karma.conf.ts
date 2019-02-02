// Karma configuration
// Generated on Sat Feb 02 2019 20:10:42 GMT+0100 (Central European Standard Time)

export default function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'karma-typescript'],


    // list of files / patterns to load in the browser
    files: [
      { pattern: '../../node_modules/expect.js/index.js' },
      "test/bootstrap.ts",
      { pattern: 'test/**/*.ts' }
    ],


    // list of files / patterns to exclude
    exclude: [],


    karmaTypescriptConfig: {
      bundlerOptions: {
        transforms: [
          require("karma-typescript-es6-transform")()
        ],
        // entrypoints: /\.spec\.ts$/
      },
      compilerOptions: {
        'module': 'commonjs',
        'moduleResolution': 'node',
        'target': 'es5',
        'noImplicitAny': false,
        'sourceMap': true,
        'emitDecoratorMetadata': true,
        'experimentalDecorators': true,
        'noEmitHelpers': false,
        'lib': [
          'es6'
        ]
      }
    },


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      '**/*.ts': 'karma-typescript'
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['mocha', 'karma-typescript'],


    client: {
      mocha: {
        reporter: 'html',
        ui: 'bdd',
        // require: [require.resolve("mocha-typescript-di-typedi")]
      }
    },


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_WARN,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['ChromeHeadless'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true

    // Concurrency level
    // how many browser should be started simultaneous
    // concurrency: Infinity
  });
}
