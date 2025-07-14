import debugModule from "debug";

const debug = debugModule("api:readme:html");

/**
 * Process the HTML content of a README file returned by GitHub API to replace relative URLs by absolute URLs.
 * TODO: we need tests to ensure we really need all these replacements as this code is pretty old!
 * Also: could it be simpler to transform Markdown to HTML by ourselves
 */
export function processReadMeHtml(html: string, repo: string, branch = "main") {
  const root = `https://github.com/${repo}`;
  let readme = html;

  // STEP 1: replace relative anchor link URL
  // [Quick Start](#quick-start) => [Quick Start](https://github.com/node-inspector/node-inspector#quick-start)"
  readme = readme.replace(/<a href="#([^"]+)">/gi, (_, p1) => {
    debug("Replace link relative anchors", p1);
    return `<a href="${root}#${p1}">`;
  });

  // STEP 2: replace links to repository files
  // Example 1: From react-router <a href="/docs">
  // [Guides and API Docs](/docs) => [Guides and API Docs](https://github.com/rackt/react-router/tree/master/docs)"
  // Example 2: from acdlite/recompose: <a href="docs">
  readme = readme.replace(/href="\/?(.+?)"/gi, (match, p1) => {
    // If the URL starts with http => do nothing
    if (p1.indexOf("http") === 0) return match;
    debug("Replace link relative URL", p1);
    return `href="${root}/blob/${branch}/${p1}"`;
  });

  // STEP 3: markdown images seen on https://github.com/MostlyAdequate/mostly-adequate-guide
  //! [cover](images/cover.png)] => ![cover](https://github.com/MostlyAdequate/mostly-adequate-guide/raw/master/images/cover.png)
  readme = readme.replace(/!\[(.+?)]\(\/(.+?)\)/gi, (_, p1, p2) => {
    debug("Replace md image relative URL", p1);
    return `[${p1}](${root}/blob/${branch}/${p2})`;
  });

  // STEP 4: replace relative image URL
  readme = readme.replace(/src="(.+?)"/gi, (_, p1) => {
    debug("Replace image relative URL", p1);
    const path = getImageAbsolutePath(repo, p1, branch);
    return `src="${path}"`;
  });

  // STEP 5: remove self closed anchors (seen on async repo)
  // the regexp matches: <a name=\"forEach\"> and <a name="forEach">
  readme = readme.replace(/<a name=\\?"(.+?)\\?" \/>/gi, () => {
    debug("Remove self closed anchor");
    return "";
  });

  // matches <a name="constant">
  readme = readme.replace(/<a name="(.+?)">/gi, () => {
    debug("Remove anchor");
    return "";
  });

  // Remove anchors automatically created for all titles
  // <a id="user-content-react-toolbox" class="anchor" href="#react-toolbox" aria-hidden="true">
  //   <span class="octicon octicon-link"></span>
  // </a>
  readme = readme.replace(
    /<a id="user-content(.*)" class="anchor" (.*?)>(.*?)<\/a>/gi,
    () => {
      debug("Remove title anchor");
      return "";
    },
  );
  return readme;
}

// Replace relative URL by absolute URL
function getImageAbsolutePath(repo: string, url: string, branch: string) {
  const root = `https://raw.githubusercontent.com/${repo}`;

  // Do nothing if the URL is absolute
  if (url.startsWith("http")) return url;

  // Special case: in Facebook Flux readme, relative URLs start with './'
  // so we just remove './' from the UL
  const path = url.startsWith("./") ? url.replace(/.\//, "") : url;

  // Add a queryString parameter to display correctly the SVG logo in `sindresorhus/ky` repo
  const isSvg = /\.svg$/i.test(url);
  const queryString = isSvg ? "?sanitize=true" : "";

  // ...otherwise we create an absolute URL to the "raw" image
  // example: images in "You-Dont-Know-JS" repo.
  return `${root}/${branch}/${path}${queryString}`;
}
