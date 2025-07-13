/* eslint-disable @typescript-eslint/no-explicit-any */
export const queryUserInfo = `query queryRepoInfo($login: String!) {
	user(login: $login) {
    login,
    name,
    bio,
    avatarUrl,
    websiteUrl,
    followers {
      totalCount
    }
  }
}`;

// biome-ignore lint/suspicious/noExplicitAny: TODO type correctly
export function extractUserInfo(response: any) {
  const {
    user: {
      login,
      name,
      bio,
      avatarUrl,
      websiteUrl,
      followers: { totalCount: followers },
    },
  } = response;
  return {
    login,
    name,
    bio,
    followers,
    avatar_url: avatarUrl,
    blog: websiteUrl,
  };
}
