var path = require('path');
var webpackConfig = require('@ionic/app-scripts/config/webpack.config');
var tsconfig = require('../tsconfig.json')

function srcPath(subdir) {
  return path.join(__dirname, "../src", subdir);
}

var resolveConfig = {
  alias: {
    app        : srcPath('app')        ,
    assets     : srcPath('assets')     ,
    components : srcPath('components') ,
    config     : srcPath('config')     ,
    directives : srcPath('directives') ,
    domain     : srcPath('domain')     ,
    lib        : srcPath('lib')        ,
    pages      : srcPath('pages')      ,
    pipes      : srcPath('pipes')      ,
    providers  : srcPath('providers')  ,
  },
  extensions: ['.ts', '.js', '.json'],
  modules: [ path.resolve('node_modules'), path.resolve(tsconfig.compilerOptions.baseUrl) ]
}

if(webpackConfig) {
  webpackConfig.resolve = resolveConfig;
}
if(webpackConfig && webpackConfig.dev && webpackConfig.dev.resolve) {
  webpackConfig.dev.resolve = resolveConfig;
}
if(webpackConfig && webpackConfig.prod && webpackConfig.prod.resolve) {
  webpackConfig.prod.resolve = resolveConfig;
}
