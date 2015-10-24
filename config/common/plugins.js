var webpack = require('webpack');

module.exports = function (filepath) {
  return [
    new webpack.optimize.CommonsChunkPlugin(/* chunkName= */'vendor', /* filename= */filepath + 'bundle-vendor.js'),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
  ];
};
