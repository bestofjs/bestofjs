declare namespace BestOfJS {
  // Project raw data from the JSON API
  interface RawProject {
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
    isFeatured: boolean;
  }

  // Project handled in the state container
  interface StateProject extends RawProject {
    slug: string;
    repository: string;
    packageName: string;
    addedPosition: number;
    isBookmark?: boolean;
  }

  // Project with the `tags` property populated "react" => {id: "react". name: "React"... }
  interface Project extends Omit<StateProject, "tags"> {
    tags: Tag[];
  }

  // Project with an additional score, used for the monthly rankings
  type ProjectWithScore = BestOfJS.Project & { score: number };

  type SearchIndexProject = Pick<
    RawProject,
    | "description"
    | "full_name"
    | "icon"
    | "name"
    | "npm"
    | "owner_id"
    | "stars"
    | "tags"
    | "url"
  > & { slug: string };

  // Project with extra data coming from the dynamic API
  interface ProjectDetails extends Project {
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
  }

  interface RawTag {
    code: string;
    name: string;
    description?: string;
  }

  interface Tag extends RawTag {
    counter?: number;
  }

  interface TagWithProjects extends BestOfJS.Tag {
    projects: BestOfJS.Project[];
  }

  type HallOfFameMember = {
    username: string;
    avatar: string;
    followers: numbers;
    bio: string;
    blog: string;
  };

  type Bookmark = { slug: string; bookmarked_at: string };

  type SortOptionKey =
    | "total"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "monthly-downloads"
    | "contributors"
    | "created"
    | "last-commit"
    | "newest"
    | "match"
    | "bookmark";
}
