// node.js server used to serve assets bundled by Webpack
// use `npm start` command to launch the server.
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack.local.config');

const port = 8080;

const options = {
  contentBase: 'www/',
  //publicPath: config.output.publicPath,
  hot: true,
  inline: true,
  progress: true
};

const server = new WebpackDevServer(webpack(config), options);
server.listen(port, 'localhost', function (err) {
  if (err) {
    console.log(err);
  }
  console.log('WebpackDevServer listening at localhost:', port);
});
