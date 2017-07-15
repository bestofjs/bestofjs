// Return the index.html html code
// Used by:
// `npm run build-html` task (server-side rendering)
// `html-webpack-plugin` to serve index.html page in dev mode.
module.exports = function({ isDev, html }) {
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title>The Best of JavaScript and the web platform</title>
    <meta name="description" content="bestof.js.org is a place where front-end engineers and node.js developers can find the best components to build amazing web applications.">
    <meta content="Best of JavaScript" property="og:title">
    <meta content="A place to find the best components to build amazing applications: JavaScript client and server side, html, CSS..." property="og:description">
    <meta content="https://bestof.js.org/images/logo2.png" property="og:image">

    <meta name="mobile-web-app-capable" content="yes">
    <link rel="manifest" href="/manifest.json">
    <link rel="icon" type="image/png" href="images/app-icon-192.png" sizes="192x192">
    <link rel="alternate" type="application/rss+xml" href="/rss/weekly-trends.xml" />
    <meta name="theme-color" content="#e65100">

    <!-- added for Github pages -->
    <link rel="shortcut icon" href="/favicon.ico">
    ${isDev
      ? '<!-- Redirect script not necessary in dev (webpack does the job) -->'
      : getRedirect()}
    ${isDev
      ? '<!-- No external stylesheet in dev mode -->'
      : '<link rel="stylesheet" href="/build/app.css">'}
  </head>
  <body>
    <div id="app">${isDev ? '' : `${html}`}</div>
    <!-- Async load cross-site CSS, mostly interesting for production -->
    <script>
      window.bestofjs = {};
      function loadCSS(e,t,n){"use strict";var i=window.document.createElement("link");var o=t||window.document.getElementsByTagName("script")[0];i.rel="stylesheet";i.href=e;i.media="only x";o.parentNode.insertBefore(i,o);setTimeout(function(){i.media=n||"all"})}
      loadCSS('https://fonts.googleapis.com/css?family=Roboto:400,300,500');
      loadCSS('https://cdnjs.cloudflare.com/ajax/libs/octicons/3.1.0/octicons.min.css');
    </script>
    <script src="/build/bundle-app.js"></script>
    <a href="https://github.com/michaelrambeau/bestofjs-webui" class="github-corner">
      <svg width="60" height="60" viewBox="0 0 250 250"><path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path><path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" style="transform-origin: 130px 106px;" class="octo-arm"></path><path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" class="octo-body"></path></svg>
    </a>
    ${isDev ? '<!-- No analytics in dev -->' : getAnalytics()}
  </body>
</html>
  `
}

// Analytics script
function getAnalytics() {
  return `<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
  ga('create', 'UA-44563970-2', 'auto');
  ga('send', 'pageview');
</script>
`
}

// Script to process page URL `?redirect=true&pathname=%2Fhof`
// when the user comes from the 404.html page.
function getRedirect() {
  return `
    <script>
    (function(l) {
      // SET THIS: e.g. my-repo-name
      var gitHubRepoName = 'bestofjs'
      // SET THIS: e.g. http://subdomain.example.tld
      var domain = 'https://bestof.js.org'
      if (l.pathname.split('/')[1] === gitHubRepoName) {
        l.replace(domain);
      } else if (l.search) {
        var q = {};
        l.search.slice(1).split('&').forEach(function(v) {
          var a = v.split('=');
          q[a[0]] = a.slice(1).join('=').replace(/%2F/g, '/').replace(/%26/g, '&');
        });
        if(q.redirect === 'true') {
          window.history.replaceState(null, null,
            (q.pathname ? q.pathname : '') +
            (q.query ? q.query : '') +
            l.hash
          );
        }
      }
    }(window.location))
    </script>
  `
}
