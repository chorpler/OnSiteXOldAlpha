// var path = require('path');
// var webpackConfig = require('@ionic/app-scripts/config/webpack.config');

// function srcPath(subdir) {
//   return path.join(__dirname, "../src", subdir);
// }

// var resolveConfig = {
//   symlinks: false,
//   alias: {
//     app        : srcPath('app')        ,
//     assets     : srcPath('assets')     ,
//     components : srcPath('components') ,
//     config     : srcPath('config')     ,
//     directives : srcPath('directives') ,
//     domain     : srcPath('domain')     ,
//     lib        : srcPath('lib')        ,
//     pages      : srcPath('pages')      ,
//     pipes      : srcPath('pipes')      ,
//     providers  : srcPath('providers')  ,
//   },
//   extensions: ['.ts', '.js', '.json'],
//   modules: [ path.resolve('node_modules'), path.resolve(tsconfig.compilerOptions.baseUrl) ]
// }

// if(webpackConfig) {
//   webpackConfig.resolve = resolveConfig;
// }
// if(webpackConfig && webpackConfig.dev && webpackConfig.dev.resolve) {
//   webpackConfig.dev.resolve = resolveConfig;
// }
// if(webpackConfig && webpackConfig.prod && webpackConfig.prod.resolve) {
//   webpackConfig.prod.resolve = resolveConfig;
// }


/*
 * The webpack config exports an object that has a valid webpack configuration
 * For each environment name. By default, there are two Ionic environments:
 * "dev" and "prod". As such, the webpack.config.js exports a dictionary object
 * with "keys" for "dev" and "prod", where the value is a valid webpack configuration
 * For details on configuring webpack, see their documentation here
 * https://webpack.js.org/configuration/
 */

var path = require('path');
// var webpack = require('webpack');
var ionicWebpackFactory = require(process.env.IONIC_WEBPACK_FACTORY);
var tsconfig = require('../tsconfig.json')

var ModuleConcatPlugin = require('webpack/lib/optimize/ModuleConcatenationPlugin');
var PurifyPlugin = require('@angular-devkit/build-optimizer').PurifyPlugin;

console.log("WEBPACK: OnSiteX Ionic environment is:");
console.log(JSON.stringify(process.env,null,2));

function srcPath(subdir) {
  return path.join(__dirname, "../src", subdir);
}

var optimizedProdLoaders = [
  {
    test: /\.json$/,
    loader: 'json-loader'
  },
  {
    test: /\.js$/,
    loader: [
      {
        loader: process.env.IONIC_CACHE_LOADER
      },

      {
        loader: '@angular-devkit/build-optimizer/webpack-loader',
        options: {
          sourceMap: false
          // sourceMap: true
        }
      },
    ]
  },
  {
    test: /\.ts$/,
    loader: [
      {
        loader: process.env.IONIC_CACHE_LOADER
      },

      {
        loader: '@angular-devkit/build-optimizer/webpack-loader',
        options: {
          // sourceMap: true
          sourceMap: false
        }
      },

      {
        loader: process.env.IONIC_WEBPACK_LOADER
      }
    ]
  }
];

function getProdLoaders() {
  if (process.env.IONIC_OPTIMIZE_JS === 'true') {
    return optimizedProdLoaders;
  }
  return devConfig.module.loaders;
}

var devConfig = {
  entry: process.env.IONIC_APP_ENTRY_POINT,
  output: {
    path: '{{BUILD}}',
    publicPath: 'build/',
    filename: '[name].js',
    devtoolModuleFilenameTemplate: ionicWebpackFactory.getSourceMapperFunction(),
  },
  devtool: process.env.IONIC_SOURCE_MAP_TYPE,

  resolve: {
    symlinks: false,
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
    // modules: [path.resolve('node_modules')]
    modules: [ path.resolve('node_modules'), path.resolve(tsconfig.compilerOptions.baseUrl) ]
  },

  module: {
    loaders: [
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.ts$/,
        loader: process.env.IONIC_WEBPACK_LOADER
      }
    ]
  },

  plugins: [
    ionicWebpackFactory.getIonicEnvironmentPlugin(),
    ionicWebpackFactory.getCommonChunksPlugin()
  ],

  // Some libraries import Node modules but don't use them in the browser.
  // Tell Webpack to provide empty mocks for them so importing them works.
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  }
};

var prodConfig = {
  entry: process.env.IONIC_APP_ENTRY_POINT,
  output: {
    path: '{{BUILD}}',
    publicPath: 'build/',
    filename: '[name].js',
    devtoolModuleFilenameTemplate: ionicWebpackFactory.getSourceMapperFunction(),
  },
  devtool: process.env.IONIC_SOURCE_MAP_TYPE,

  resolve: {
    symlinks: false,
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
    // modules: [path.resolve('node_modules')]
    modules: [ path.resolve('node_modules'), path.resolve(tsconfig.compilerOptions.baseUrl) ]
  },

  module: {
    loaders: getProdLoaders()
  },

  plugins: [
    ionicWebpackFactory.getIonicEnvironmentPlugin(),
    ionicWebpackFactory.getCommonChunksPlugin(),
    new ModuleConcatPlugin(),
    new PurifyPlugin()
  ],

  // Some libraries import Node modules but don't use them in the browser.
  // Tell Webpack to provide empty mocks for them so importing them works.
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  }
};


module.exports = {
  dev: devConfig,
  prod: prodConfig
}

