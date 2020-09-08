module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],
    files: ['spec/**/*.js'],
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_WARN,
    browsers: ['CustomElectron'],
    autoWatch: false,
    singleRun: true,
    concurrency: 1,
    preprocessors: {
      '**/*.js': ['electron']
    },
    client: {
      useIframe: false,
      __filenameOverride: __dirname + '/metro/index.html'
    },
    customLaunchers: {
      CustomElectron: {
        base: 'Electron',
        browserWindowOptions: {
          webPreferences: {
            nodeIntegration: true,
            worldSafeExecuteJavaScript: true
          }
        }
      }
    }
  })
}
