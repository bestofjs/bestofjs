//Script to deploy the build folder to the ``gh-pages` of `bestofjs` repo.
//URL: http://michaelrambeau.github.io/bestofjs
//Launched by `npm deploy` command.
//Don't forget to build the pages in production mode using `npm run build` command before!
var ghpages = require('gh-pages');
var path = require('path');

//Folder to deploy to Github pages (relative to the current file)
var BUILD_FOLDER = '../www';

var options = {
  repo: 'https://github.com/michaelrambeau/bestofjs.git',
  message: 'Deploy command'
};

var callback = function (err) {
  if (err) return console.log('Unable to push to gh-pages', err.message);
  console.log('Deploy completed!');
};


console.log('Pushing build folder to gh-pages on ', options.repo);

ghpages.publish(path.join(__dirname, BUILD_FOLDER), options, callback);
