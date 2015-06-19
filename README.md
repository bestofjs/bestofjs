#  bestof.js.org front end application

## Concept

bestof.js.org is a place to check the latest tendancies about open source projects related to the JavaScript world.
This is a place where font-end engineers and node.js developers can find the best components to build amazing web applications:

* Frameworks
* Librairies
* CSS tools
* Testing tools
* and many other things...

## Overview

This is the front-end application, a single-page application built with the following technologies:

* React
* React router
* Reflux
* Webpack
* Material UI

Webpack is used to built the application in development and production mode.

## Development workflow

Start the web server and watch for changes on the filesystem:

```
npm init
```

The application should be running at [localhost:8080](http://localhost:8080/)


Note: built files are not written on the disk, they are served by the server that keep them in memory.

## Production deploy

Build the files for production:
```
npm run build
```
