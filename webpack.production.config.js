var webpack = require('webpack');

module.exports = {

  // Set entry point to ./src/main and include necessary files for hot load
  entry:  {
    app: "./entry.jsx",
    vendor: ["react", "react-router", "material-ui", 'reflux', 'superagent', 'lodash', "./stylesheets/main.less",'markdown']
  },

  // This will not actually create a bundle.js file in ./build. It is used
  // by the dev server for dynamic hot loading.
  output: {
    //path: __dirname + "/build/",
    filename: "build/bundle-[name].js"
  },

  // Transform source code using Babel and React Hot Loader
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
    new webpack.optimize.CommonsChunkPlugin(/* chunkName= */"vendor", /* filename= */"build/bundle-vendor.js")
  ],

  // Automatically transform files with these extensions
  resolve: {
    extensions: ['', '.js', '.jsx', '.coffee', '.cjsx']
  }
};
