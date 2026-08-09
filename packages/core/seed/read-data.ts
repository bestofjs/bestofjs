const dataDir = process.env.MONGODB_DATA_FOLDER;
if (!dataDir) {
  throw new Error("Missing MONGODB_DATA_FOLDER environment variable");
}

export type MongoTag = {
  _id: { $oid: string };
  name: string;
  code: string;
  description: string;
  aliases: string[];
  createdAt: MongoDate;
  updatedAt: MongoDate;
};

export type MongoProject = {
  _id: { $oid: string };
  name: string;
  slug: string;
  description?: string;
  override_description: boolean;
  status?: "active" | "featured" | "promoted" | "deprecated";
  deprecated: boolean;
  tags: { $oid: string }[];
  createdAt: MongoDate;
  updatedAt: MongoDate;
  url: string;
  override_url: boolean;
  logo: string;
  twitter: string;
  comments: string;
  github: {
    branch: string;
    name: string;
    full_name: string;
    description: string;
    stargazers_count: number;
    owner_id: string;
    homepage: string;
    archived: boolean;
    commit_count: number;
    contributor_count: number;
    created_at: MongoDate;
    last_commit: MongoDate;
    pushed_at: MongoDate;
    updatedAt: MongoDate;
    topics: string[];
  };
  npm: {
    name: string;
    version: string;
    dependencies: string[];
    deprecated: boolean;
  };
  downloads: {
    monthly: number;
  };
  bundle: {
    name: string;
    version: string;
    gzip: number;
    size: number;
    updatedAt: MongoDate;
    duration: number;
  };
};

export type MongoDateNumber = { $numberLong: string };
export type MongoDateCompact = string;
export type MongoDate = { $date: MongoDateNumber | MongoDateCompact };

export type MongoSnapshot = {
  _id: { $oid: string };
  project: { $oid: string };
  year: number;
  months: MonthData[];
  createdAt?: MongoDate;
  updatedAt?: MongoDate;
};

type MonthData = {
  month: number;
  snapshots: { day: number; stars: number }[];
};

export type Hero = {
  _id: { $oid: string };
  createdAt: MongoDate;
  updatedAt: MongoDate;
  github: {
    login: string;
    name: string;
    avatar_url: string;
    bio: string;
    twitter: string;
    homepage: string;
    followers: number;
  };
  projects: { $oid: string }[];
  npm: {
    username: string;
    count: number;
  };
  short_bio: string;
  url: string;
  name?: string;
};

export function getDateFromMongoValue(value?: MongoDate) {
  if (!value?.$date) return null;
  if (typeof value.$date !== "string" && "$numberLong" in value.$date) {
    return new Date(Number(value.$date.$numberLong));
  }
  return new Date(value.$date);
}

export function fetchFeaturedProjects() {
  return fetchAllProjects().then((projects) => {
    return projects.filter((project) => project.status === "featured");
  });
}

export function fetchPopularProjects() {
  return fetchAllProjects().then((projects) => {
    return projects.filter((project) => {
      return !project.deprecated && project.github?.stargazers_count > 1000;
    });
  });
}

export function fetchNonDeprecatedProjects() {
  return fetchAllProjects().then((projects) => {
    return projects.filter((project) => !project.deprecated);
  });
}

const backupPrefix = "bestofjs-db1";

export async function fetchAllProjects() {
  const path = `${dataDir}/${backupPrefix}.projects.json`;
  const file = Bun.file(path);
  const contents = await file.json();
  return contents as MongoProject[];
}

export async function fetchTags() {
  const path = `${dataDir}/${backupPrefix}.tags.json`;
  const file = Bun.file(path);
  const contents = await file.json();
  return contents as MongoTag[];
}

export async function fetchAllSnapshotsByYear() {
  const path = `${dataDir}/${backupPrefix}.snapshots.json`;
  const file = Bun.file(path);
  const contents = await file.json();
  return contents as MongoSnapshot[];
}

export async function fetchSnapshotsByYear(year: number) {
  const snapshots = await fetchAllSnapshotsByYear();
  return snapshots.filter((snapshot) => snapshot.year === year);
}

export async function fetchHeroes() {
  const path = `${dataDir}/${backupPrefix}.heroes.json`;
  const file = Bun.file(path);
  const contents = await file.json();
  return contents as Hero[];
}
