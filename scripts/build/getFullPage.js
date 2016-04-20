// Return the index.html html code
// Used by:
// `npm run build-html` task (server-side rendering)
// `html-webpack-plugin` to serve index.html page in dev mode.
module.exports = function (dev, appHtml) {
  console.log(`Get html template in ${dev ? 'dev' : 'production'} mode`);
  return (`<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title>The Best of JavaScript and the web platorm</title>
    <meta name="description" content="bestof.js.org is a place where front-end engineers and node.js developers can find the best components to build amazing web applications.">
    <meta content="Best of JavaScript" property="og:title">
    <meta content="A place to find the best components to build amazing applications: JavaScript client and server side, html, CSS..." property="og:description">
    <meta content="http://bestof.js.org/images/logo2.png" property="og:image">
    <!-- added for Github pages -->
    <link rel="shortcut icon" href="favicon.ico">
    ${dev ? '<!-- No external stylesheet in dev mode -->' : '<link rel="stylesheet" href="build/app.css">'}
  </head>
  <body>
    <div id="app"><div>${dev ? '' : `${appHtml}`}</div></div>
    <!-- Async load cross-site CSS, mostly interesting for production -->
    <script>
      window.bestofjs = {};
      function loadCSS(e,t,n){"use strict";var i=window.document.createElement("link");var o=t||window.document.getElementsByTagName("script")[0];i.rel="stylesheet";i.href=e;i.media="only x";o.parentNode.insertBefore(i,o);setTimeout(function(){i.media=n||"all"})}
      loadCSS('https://fonts.googleapis.com/css?family=Roboto:400,300,500');
      loadCSS('https://cdnjs.cloudflare.com/ajax/libs/octicons/3.1.0/octicons.min.css');
    </script>
    <script src="build/bundle-app.js"></script>
    ${dev ? '<!-- No analytics in dev -->' : getAnalytics() }
  </body>
</html>
  `);
};

function getAnalytics() {
  return (`<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
  ga('create', 'UA-44563970-2', 'auto');
  ga('send', 'pageview');
</script>
`);
}
