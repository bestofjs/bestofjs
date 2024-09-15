import { shuffle } from "@/helpers/shuffle";

export type RawData = {
  projects: BestOfJS.RawProject[];
  tags: BestOfJS.RawTag[];
  date: string;
};

export type Data = {
  projectCollection: BestOfJS.RawProject[];
  featuredProjectIds: BestOfJS.Project["slug"][];
  tagCollection: BestOfJS.RawTag[];
  tagsByKey: { [key: string]: BestOfJS.Tag };
  populate: (project: BestOfJS.RawProject) => BestOfJS.Project;
  projectsBySlug: { [key: string]: BestOfJS.RawProject };
  lastUpdateDate: Date;
};

export type APIContext = {
  getData: () => Promise<Data>;
};

export const populateProject =
  (tagsByKey: { [key: string]: BestOfJS.Tag }) =>
  (project: BestOfJS.RawProject) => {
    const populated = { ...project } as unknown as BestOfJS.Project;
    const { full_name, tags } = project;

    if (full_name) {
      populated.repository = "https://github.com/" + full_name;
    }

    if (tags) {
      populated.tags = tags.map((id) => tagsByKey[id]).filter((tag) => !!tag);
    }

    if (project.npm) {
      populated.packageName = project.npm; // TODO fix data?
    }

    return populated;
  };

export function getFeaturedRandomList(projects: BestOfJS.RawProject[]) {
  const slugs = projects
    .filter((project) => project.status === "featured")
    .map((project) => project.slug);

  return shuffle(slugs);
}

export function getTagsByKey(
  tags: BestOfJS.RawTag[],
  projects: BestOfJS.RawProject[]
) {
  const byKey = {} as { [tag: string]: BestOfJS.Tag };

  tags.forEach((tag) => {
    byKey[tag.code] = {
      code: tag.code,
      counter: 0,
      description: tag.description,
      name: tag.name,
    };
  });

  projects.forEach(({ tags }) => {
    tags.forEach((tag) => {
      byKey[tag].counter = byKey[tag].counter ? byKey[tag].counter + 1 : 1;
    });
  });

  return byKey;
}
