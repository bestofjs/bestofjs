const webpack = require('webpack');
const getVendorModules = require('./common/vendor');
const getCommonPlugins = require('./common/plugins');

// filepath used in `output` and `plugins`
const filepath = 'build/';

// http://stackoverflow.com/questions/30030031/passing-environment-dependent-constiables-in-webpack
const envPlugin = new webpack.DefinePlugin({
  'process.env': {
    'NODE_ENV': JSON.stringify('development')
  }
});
const plugins = getCommonPlugins(filepath).slice();
plugins.push(envPlugin);
plugins.push(new webpack.NoErrorsPlugin());// tells the reloader to not reload if there is a syntax error in your code. The error is simply printed in the console, and the component will reload when you fix the error.)

const modules = getVendorModules();
modules.push('redux-logger');// use redux-logger only in dev

module.exports = {
  // Efficiently evaluate modules with source maps
  devtool: 'eval',
  entry: {
    app: [
      "webpack-dev-server/client?http://localhost:8080",
      "webpack/hot/only-dev-server",
      "./src/entry.jsx"
    ],
    vendor: modules
  },
  // This will not actually create a bundle.js file in ./build. It is used
  // by the dev server for dynamic hot loading.
  output: {
    // path: __dirname + "/build/",
    filename: filepath + 'bundle-[name].js'
  },

  // Transform source code using Babel and React Hot Loader
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: ["react-hot", "babel"]
      },
      { test: /\.styl$/, loader: 'style-loader!css-loader!stylus-loader' }, // use ! to chain loaders
      { test: /\.css$/, loader: 'style-loader!css-loader' },
    ]
  },

  plugins,

  // Automatically transform files with these extensions
  resolve: {
    extensions: ['', '.js', '.jsx', '.coffee']
  }
};
