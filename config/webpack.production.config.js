var webpack = require('webpack');
var getVendorModules = require('./common/vendor');
var getCommonPlugins = require('./common/plugins');

//filepath used in `output` and `plugins`
var filepath = './www/build/';

var envPlugin = new webpack.DefinePlugin({
  'process.env': {
    'NODE_ENV': JSON.stringify('production'),
    'API':  JSON.stringify('https://bestofjs-api-v1.firebaseapp.com/')
   }
});
var plugins = getCommonPlugins(filepath).slice();
plugins.push(envPlugin);

module.exports = {

  entry:  {
    app: "./src/entry.jsx",
    vendor: getVendorModules()
  },

  output: {
    //path: __dirname + "/build/",
    filename: filepath + "bundle-[name].js"
  },

  module: {
    loaders: [
      { test: /\.jsx?$/, exclude: /node_modules/, loader: "babel"},
      { test: /\.styl$/, loader: 'style-loader!css-loader!stylus-loader' }, // use ! to chain loaders
      { test: /\.css$/, loader: 'style-loader!css-loader' },
    ]
  },

  plugins: plugins,

  // Automatically transform files with these extensions
  resolve: {
    extensions: ['', '.js', '.jsx', '.coffee']
  }
};
