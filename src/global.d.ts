declare namespace BestOfJS {
  type RawProject = {
    name: string;
    full_name: string;
    description: string;
    tags: string[];
    stars: number;
    trends: {
      daily: number;
      weekly?: number;
      monthly?: number;
      yearly?: number;
    };
    delta?: number; // from monthly rankings section
    contributor_count: number;
    pushed_at: string;
    created_at: string;
    owner_id: string;
    url: string;
    branch: string;
    npm: string;
    downloads: number;
    icon: string;
  };

  type Project = RawProject & {
    slug: string;
    repository: string;
    packageName: string;
    addedPosition: number;
    isBookmark?: boolean;
  };

  type ProjectDetails = Project & {
    commit_count: number;
    created_at: string;
    bundle: {
      dependencyCount: number;
      gzip: number;
      name: string;
      size: number;
      version: string;
      errorMessage?: string;
    };
    npm: {
      dependencies: string[];
      deprecated: boolean;
      name: string;
      version: string;
    };
    packageSize: {
      installSize: number;
      publishSize: number;
      version: string;
    };
    timeSeries: {
      daily: number[];
      monthly: {
        year: number;
        month: number;
        firstDay: number;
        lastDay: number;
        delta: number;
      }[];
    };
  };

  type Tag = {
    id: string;
    code: string;
    name: string;
    description: string;
    counter: number;
  };

  type HallOfFameMember = {
    username: string;
    avatar: string;
    followers: numbers;
    bio: string;
    blog: string;
  };

  type Bookmark = { slug: string; bookmarked_at: string };
}
