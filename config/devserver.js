// node.js server used to serve assets bundled by Webpack
// use `npm start` command to launch the server.
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack.local.config');
const constants = require('./constants');

const port = constants.port;
const contentBase = `${constants.staticFolder}/`;

const options = {
  contentBase,
  hot: true,
  stats: {
    colors: true
  }
};

const server = new WebpackDevServer(webpack(config), options);
server.listen(port, 'localhost', function (err) {
  if (err) {
    console.log(err);
  }
  console.log('Bestofjs WebpackDevServer listening at localhost:', port, 'Serving content from', contentBase);
});
