module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],
    files: ['spec/**/*.js'],
    reporters: ['dots'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_WARN,
    browsers: ['JasmineElectron'],
    autoWatch: false,
    singleRun: true,
    concurrency: 1,
    preprocessors: {
      '**/*.js': ['electron']
    },
    client: {
      useIframe: false,
      __filenameOverride: __dirname + '/app/index.html'
    },
    customLaunchers: {
      JasmineElectron: {
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
