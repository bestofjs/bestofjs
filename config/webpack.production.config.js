const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const getCommonPlugins = require('./common/plugins');

// filepath used in `output` and `plugins`
const filepath = './www/build/';

const envPlugin = new webpack.DefinePlugin({
  'process.env': {
    'NODE_ENV': JSON.stringify('production')
  }
});
const plugins = [];
plugins.push(envPlugin);

// ExtractTextPlugin used to generate a separate CSS file, in production only.
// documentation: http://webpack.github.io/docs/stylesheets.html
plugins.push(new ExtractTextPlugin('./www/build/[name].css'));

plugins.push(new webpack.optimize.UglifyJsPlugin({
  compress: {
    warnings: false
  }
}));

module.exports = {
  entry: {
    app: './src/entry.jsx'
  },

  output: {
    // path: __dirname + "/build/",
    filename: filepath + 'bundle-[name].js'
  },

  module: {
    loaders: [
      { test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel' },
      { test: /\.styl$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader!stylus-loader') }, // use ! to chain loaders
      { test: /\.css$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader') },
    ]
  },

  plugins,

  // Automatically transform files with these extensions
  resolve: {
    extensions: ['', '.js', '.jsx']
  }
};
