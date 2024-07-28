/* eslint-disable @typescript-eslint/no-explicit-any */
import emojiRegex from "emoji-regex";

export const queryRepoInfo = `query getRepoInfo($owner: String!, $name: String!) {
  repository(owner: $owner, name: $name) {
    name
    description
    homepageUrl,
    createdAt
    pushedAt
    updatedAt
    isArchived
    diskUsage
    forkCount
    isArchived
    owner {
      login
      avatarUrl
    }
		stargazers{
      totalCount
    }
    repositoryTopics(last: 20) {
      totalCount
      edges {
        node {
          topic {
            name
          }
        }
      }
    }
    ... on Repository {
      defaultBranchRef {
        name
        target {
          ... on Commit {
            history(first: 1) {
              totalCount,
              edges {
                node {
                  ... on Commit {
                    committedDate
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}`;

export function extractRepoInfo(response: any) {
  const {
    repository: {
      owner: { avatarUrl, login },
      name,
      description,
      homepageUrl: homepage,
      createdAt: created_at,
      pushedAt: pushed_at,
      stargazers: { totalCount: stargazers_count },
      repositoryTopics: { edges: topicEdges },
      isArchived,
      defaultBranchRef: {
        name: default_branch,
        target: {
          history: { totalCount: commit_count, edges: commitEdges },
        },
      },
    },
  } = response;

  const topics = topicEdges.map(getTopic);
  const last_commit = new Date(commitEdges[0].node.committedDate);
  const owner_id = extractOwnerIdFromAvatarURL(avatarUrl);
  const full_name = `${login}/${name}`;

  return {
    name,
    full_name,
    owner: login,
    owner_id,
    description: cleanGitHubDescription(description),
    homepage,
    created_at: toDate(created_at),
    pushed_at: toDate(pushed_at),
    default_branch,
    stargazers_count,
    topics,
    archived: isArchived,
    commit_count,
    last_commit,
  };
}

const getTopic = (edge: any) => edge.node.topic.name;

// TODO: extract the user "short id" from the GraphQL query?
function extractOwnerIdFromAvatarURL(url: string) {
  const re = /\/u\/(.+)\?/;
  const parts = re.exec(url);
  if (parts) return parts[1];
}

function cleanGitHubDescription(description: string) {
  if (!description) description = ""; // some projects return `null` (SocketIO, Handlebars...)
  description = removeGitHubEmojis(description);
  description = removeGenericEmojis(description);
  return description;
}

function removeGitHubEmojis(input: string) {
  return input.replace(/(:([a-z_\d]+):)/g, "").trim();
}

function removeGenericEmojis(input: string) {
  return input
    .replace(emojiRegex(), "")
    .replace(new RegExp(String.fromCharCode(65039), "g"), "") // clean weird white chars around emojis (E.g. ChakraUI)
    .trim();
}

function toDate(input: string) {
  return new Date(input);
}
