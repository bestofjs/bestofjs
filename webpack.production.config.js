var webpack = require('webpack');

//filepath used in `output` and `plugins`
var filepath = './www/build/';

var envPlugin = new webpack.DefinePlugin({
  'process.env': {
    'NODE_ENV': JSON.stringify('production'),
    'API':  JSON.stringify('https://bestofjs.herokuapp.com/')
   }
});

module.exports = {

  entry:  {
    app: "./entry.jsx",
    vendor: [
      "react",
      "react-router",
      "material-ui",
      'reflux',
      'superagent',
      'lodash'
    ]
  },

  output: {
    //path: __dirname + "/build/",
    filename: filepath + "bundle-[name].js"
  },

  module: {
    loaders: [
      { test: /\.jsx?$/, exclude: /node_modules/, loaders: ["babel-loader"]},
      { test: /\.cjsx$/, loader: "coffee-jsx-loader" },
      { test: /\.coffee$/, loader: 'coffee-loader' },
      { test: /\.less$/, loader: 'style-loader!css-loader!less-loader' }, // use ! to chain loaders
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
    extensions: ['', '.js', '.jsx', '.coffee', '.cjsx']
  }
};
