![bestofjs logo](http://bestof.js.org/images/logo.png)

## Concept


[bestof.js.org](http://bestof.js.org/) is an application to check the latest trends about open source projects related to the JavaScript world.
This is a place where font-end engineers and node.js developers can find the best components to build amazing web applications:

* Frameworks
* Librairies
* CSS tools
* Testing tools
* and many other things...

## Technical overview

This is the front-end application, a single-page application built with the following technologies:

* [React](http://facebook.github.io/react/)
* [React router](https://github.com/rackt/react-router)
* [Reflux](https://github.com/spoike/refluxjs)
* [Webpack](http://webpack.github.io/)

Webpack is used to built the application in development and production mode.

## Development workflow

Start the web server and watch for changes on the filesystem:

```
npm start
```

The application should be running at [localhost:8080](http://localhost:8080/)


Thank to [React hot loader](http://gaearon.github.io/react-hot-loader/), every time a React component is updated, the UI is automatically updated, without losing the application state.

Note: built files are not written on the disk, they are served by the Webpack server that keeps them in memory. Therefore before uploading files to the production web server, the production files have to be built using a specific command.

## Production deploy

Build the files for production:

```
npm run build
```

Push to Github pages
```
npm run gh-pages
```

Note: a specific repository [bestofjs](https://github.com/michaelrambeau/bestofjs), that contains only one branch `gh-pages`, has been created to host the content on Github pages.

These 2 commands can be combined calling

```
npm run deploy
```
