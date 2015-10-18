var webpack = require('webpack');
var getVendorModules = require('./common/vendor');

//filepath used in `output` and `plugins`
var filepath = './www/build/';

var envPlugin = new webpack.DefinePlugin({
  'process.env': {
    'NODE_ENV': JSON.stringify('production'),
    'API':  JSON.stringify('http://bestofjs-api-v1.divshot.io/'),
    //URL of the "get-readme" micro-service raw code on the MASTER branch ( = production)
    'GET_README': JSON.stringify('https://webtask.it.auth0.com/api/run/wt-mikeair-gmail_com-0/85801138b3a9d89112d0a04eef536d1f?webtask_no_cache=1')
   }
});

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
      { test: /\.jsx?$/, exclude: /node_modules/, loaders: ["babel-loader"]},
      { test: /\.coffee$/, loader: 'coffee-loader' },
      { test: /\.styl$/, loader: 'style-loader!css-loader!stylus-loader' }, // use ! to chain loaders
      { test: /\.css$/, loader: 'style-loader!css-loader' },
    ]
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin(/* chunkName= */'vendor', /* filename= */filepath + 'bundle-vendor.js'),
    envPlugin
  ],

  // Automatically transform files with these extensions
  resolve: {
    extensions: ['', '.js', '.jsx', '.coffee']
  }
};
