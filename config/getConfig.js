// Generate Webpack config, dependending on the environment (development or production)
// The exported function is used by `webpack.*.config.js` files.

const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const getFullPage = require('../scripts/build/getFullPage');
const constants = require('./constants');

function getPlugins(env) {
  const envPlugin = new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify(env)
    }
  });

  // fetch polyfill, see http://mts.io/2015/04/08/webpack-shims-polyfills/
  // const fetchPlugin = new webpack.ProvidePlugin({
  //   'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
  // });

  const plugins = [envPlugin];
  if (env === 'development') {
    plugins.push(new webpack.HotModuleReplacementPlugin());
    // Get the html template
    const html = getFullPage(true);
    plugins.push(new HtmlWebpackPlugin({
      inject: false,
      templateContent: html
    }));
    // tells the reloader to not reload if there is a syntax error in your code.
    // The error is simply printed in the console, and the component will reload when you fix the error.)
    plugins.push(new webpack.NoErrorsPlugin());
  } else {
    // ExtractTextPlugin used to generate a separate CSS file, in production only.
    // documentation: http://webpack.github.io/docs/stylesheets.html
    plugins.push(
      new ExtractTextPlugin(`./${constants.staticFolder}/build/[name].css`)
    );

    // Do not display warning messages from Uglify
    plugins.push(
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      })
    );
  }

  return plugins;
}

function getLoaders(env) {
  const jsLoader = {
    test: /\.jsx?$/,
    exclude: /node_modules/,
    loaders: env === 'development' ? ['react-hot', 'babel'] : ['babel']
  };

  const cssLoader = {
    test: /\.css$/
  };
  const stylusLoader = {
    test: /\.styl$/
  };

  // json loader used to read `package.json`
  const jsonLoader = {
    test: /\.json$/,
    loader: 'json'
  };

  const urlLoader = {
    test: /\.svg$/,
    loader: 'url-loader?limit=5000'
  };

  if (env === 'development') {
    cssLoader.loader = 'style-loader!css-loader!postcss-loader';
    stylusLoader.loader = 'style-loader!css-loader!stylus-loader';
  } else {
    cssLoader.loader = ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader');
    stylusLoader.loader = ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader!stylus-loader');
  }
  const loaders = [jsLoader, jsonLoader, stylusLoader, cssLoader, urlLoader];
  return loaders;
}

function getEntry(env) {
  return {
    app: env === 'development' ? (
      [
        `webpack-dev-server/client?http://localhost:${constants.port}`,
        'webpack/hot/only-dev-server',
        './src/entry.js'
      ]
    ) : (
      './src/entry.js'
    )
  };
}

function getOutput(env) {
  const rootPath = path.resolve(__dirname, '..', constants.staticFolder);
  const filename = 'build/bundle-[name].js';
  return env === 'development' ? (
    {
      path: rootPath,
      filename,
      hot: true,
      publicPath: '/' // required when using browserHistory, to make nested URLs work
    }
  ) : (
    {
      filename: `${constants.staticFolder}/${filename}`
    }
  );
}

module.exports = function (env) {
  const config = {
    debug: true,
    noInfo: true, // set to false to see a list of every file being bundled.
    entry: getEntry(env),
    target: env === 'test' ? 'node' : 'web', // necessary per https://webpack.github.io/docs/testing.html#compile-and-test
    output: getOutput(env),
    plugins: getPlugins(env),
    module: {
      loaders: getLoaders(env)
    },
    resolve: {
      extensions: ['', '.js', '.jsx']
    },
    postcss() {
      return [autoprefixer];
    }
  };
  if (env === 'development') {
    config.devtool = 'eval';
  }
  return config;
};
