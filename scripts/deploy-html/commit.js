// http://patrick-mckinley.com/tech/github-api-commit.html
// https://developer.github.com/v3/git/trees/#create-a-tree
// res OK: https://api.github.com/repos/michaelrambeau/bestofjs-sandbox/git/trees/7ae78d865d5c198f977b33f73ee725187839ed49
const fetch = require('node-fetch');
const GITHUB_BASE_URL = 'https://api.github.com';

function commit({
  filepath = 'index.html',
  content = `<p>Empty content, created at ${new Date()}</p>`,
  repo,
  branch,
  message,
  token
}) {
  const BASE_URL = `${GITHUB_BASE_URL}/repos/${repo}`;

  const log = console.log;

  // Helper to make API requests
  const githubFetch = (url, options) => {
    const fetchUrl = `${BASE_URL}/${url}?access_token=${token}`;
    log('API request', fetchUrl);
    return fetch(fetchUrl, options)
      .then(checkStatus)
      .then(r => r.json())
      .catch(err => log(err.message));
  };

  // STEP 1: fetch last commit
  const getInitialCommitSha = () => {
    log('STEP 1');
    return githubFetch(`commits/refs/heads/${branch}`)
      .then(json => json.sha);
  };

  // STEP 2: fetch the tree
  const fetchTree = (sha) => {
    log('STEP 2: fetching tree from sha', sha);
    return githubFetch(`commits/${sha}`)
      .then(json => {
        const treeSha = json.commit.tree.sha;
        return treeSha;
      });
  };

  // STEP 3: create a new tree
  const createTree = (treeSha) => {
    const options = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        base_tree: treeSha,
        tree: [
          {
            path: filepath,
            mode: '100644',
            type: 'blob',
            content
          }
        ]
      })
    };
    log('STEP 3: create a new tree', treeSha);
    return githubFetch(`git/trees`, options);
  };

  // STEP 4: Create a commit
  const createCommit = (initialCommitSha, newTreeSha) => {
    const options = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        parents: [initialCommitSha],
        tree: newTreeSha,
        message
      })
    };
    log('STEP 4: create a commit', initialCommitSha, newTreeSha);
    return githubFetch(`git/commits`, options);
  };

  // STEP 5: link commit to the reference
  const linkCommit = (commitSha) => {
    const options = {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sha: commitSha
      })
    };
    log('STEP 5: link commit to the reference', commitSha);
    return githubFetch(`git/refs/heads/${branch}`, options);
    // if OK, the response will be:
    // {
    // 	ref: 'refs/heads/gh-pages',
    // 	url: 'https://api.github.com/repos/michaelrambeau/bestofjs-sandbox/git/refs/heads/gh-pages',
    // 	object: {
    // 		sha: '35b48c392bd9716dab2da3fa2a7bb36b70243636',
    // 		type: 'commit',
    // 		url: 'https://api.github.com/repos/michaelrambeau/bestofjs-sandbox/git/commits/35b48c392bd9716dab2da3fa2a7bb36b70243636'
    // 	}
    // }
  };

  getInitialCommitSha()
    .then(sha => {
      fetchTree(sha)
        .then(treeSha => createTree(treeSha))
        .then(json => {
          const newTreeSha = json.sha;
          return createCommit(sha, newTreeSha);
        })
        .then(json => {
          const commitSha = json.sha;
          return linkCommit(commitSha);
        })
        .then(json => log('FINISH!', json));
    })
    .catch(error => log('ERROR', error));
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

module.exports = commit;
