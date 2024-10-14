export type ProjectItem = {
  name: string;
  slug: string;
  added_at: string;
  description: string;
  url?: string;
  stars: number;
  full_name: string;
  owner_id: number;
  created_at: string;
  pushed_at: string;
  contributor_count: number | null;
  status: string;
  tags: string[];
  trends: {
    daily?: number;
    weekly?: number | null;
    monthly?: number | null;
    yearly?: number | null;
  };
  npm?: string;
  downloads?: number;
  icon?: string;
};
