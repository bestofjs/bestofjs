import { eq } from "drizzle-orm";
import slugify from "slugify";

import {
  MongoProject,
  fetchAllProjects,
  fetchFeaturedProjects,
  getDateFromMongoValue,
} from "./read-data";
import { DB } from "../src/index";
import * as schema from "../src/schema";
import { runDbScript } from "./run-db-script";

const debug = false;
const CHECK_EXISTING_DATA = false;

runDbScript(async (db: DB, spinner) => {
  const projects = debug
    ? await fetchFeaturedProjects()
    : await fetchAllProjects();

  let i = 0;
  let imported = 0;
  let skipped = 0;

  for (const project of projects) {
    i++;
    spinner.message(
      `Importing project ${i}/${projects.length} ${project.name}`
    );

    try {
      if (await shouldBeImported(project)) {
        const repoRecord = getRepoRecord(project);
        await db.insert(schema.repos).values(repoRecord);

        const projectRecord = {
          ...getProjectRecord(project),
          repoId: repoRecord.id,
        };

        await db.insert(schema.projects).values(projectRecord);

        const projectsToTagsRecords = project.tags.map((tag) => {
          return {
            projectId: getId(project),
            tagId: tag.$oid,
          };
        });

        try {
          await db.insert(schema.projectsToTags).values(projectsToTagsRecords);
        } catch (error) {
          console.error(projectsToTagsRecords);
          throw new Error(
            `Unable to process project tags for ${project.name} ${
              (error as Error).message
            }`
          );
        }

        await importPackageData(project, projectRecord.id);
        imported++;
      } else {
        skipped++;
      }
    } catch (error) {
      console.error(error);
      throw new Error(`Error importing project ${project.name}`);
    }
  }
  spinner.stop(` ${imported} projects imported, ${skipped} skipped.`);

  async function importPackageData(project: MongoProject, projectId: string) {
    const packageRecord = getPackageRecord(project);
    if (!packageRecord) {
      return;
    }

    await db
      .insert(schema.packages)
      .values({ ...packageRecord, projectId: projectId });

    const bundleRecord = getBundleRecord(project);
    if (bundleRecord) {
      await db.insert(schema.bundles).values(bundleRecord);
    }
  }

  async function shouldBeImported(project: MongoProject) {
    if (!Boolean(project.github?.created_at)) return false; // some very old deprecated projects have no repo `created_at` date
    if (!CHECK_EXISTING_DATA) return true;
    return !(await isProjectAlreadyImported(project));
  }

  async function isProjectAlreadyImported(project: MongoProject) {
    const foundProject = await db.query.projects.findFirst({
      where: eq(schema.projects.name, project.name),
    });
    return Boolean(foundProject);
  }
});

function getId(doc: MongoProject) {
  return doc._id.$oid;
}

export function getProjectSlug(project: MongoProject) {
  return slugify(project.name, { lower: true, remove: /[.'/]/g });
}

function getProjectRecord(project: MongoProject) {
  const projectRecord = {
    id: getId(project),
    name: project.name,
    slug: getProjectSlug(project),
    description: project.description || project.github.description, // some docs have no `description`
    overrideDescription: project.override_description,
    url: project.url,
    overrideURL: project.override_url,
    status: getStatus(project),
    logo: project.logo,
    twitter: project.twitter,
    comments: project.comments,
    createdAt: getDateFromMongoValue(project.createdAt) as Date,
    updatedAt: getDateFromMongoValue(project.updatedAt),
  };
  return projectRecord;
}

function getStatus(project: MongoProject) {
  if (project.deprecated) return "deprecated";
  return project.status || "active";
}

function getRepoRecord(doc: MongoProject) {
  const data = doc.github;
  const record = {
    id: getId(doc),
    added_at: getDateFromMongoValue(doc.createdAt) as Date,
    owner_id: data.owner_id,
    name: data.name,
    full_name: data.full_name,
    stars: data.stargazers_count,
    description: data.description,
    homepage: data.homepage,
    archived: data.archived,
    default_branch: data.branch,
    topics: data.topics,

    created_at: getDateFromMongoValue(data.created_at) as Date,
    pushed_at: getDateFromMongoValue(data.pushed_at) as Date,
    last_commit: getDateFromMongoValue(data.last_commit),
    updated_at: getDateFromMongoValue(data.updatedAt),

    commit_count: data.commit_count,
    contributor_count: data.contributor_count,
  };
  return record;
}

function getPackageRecord(doc: MongoProject) {
  const data = doc.npm;
  if (!data?.name) return null;
  const record = {
    name: data.name,
    version: data.version,
    dependencies: data.dependencies,
    devDependencies: [],
    deprecated: data.deprecated,
    createdAt: getDateFromMongoValue(doc.createdAt),
    monthlyDownloads: doc.downloads?.monthly,
  };
  return record;
}

function getBundleRecord(doc: MongoProject) {
  const data = doc.bundle;
  if (!data?.name) return null;
  const record = {
    name: data.name,
    version: data.version,
    gzip: data.gzip,
    size: data.size,
    duration: data.duration,
    updated_at: getDateFromMongoValue(data.updatedAt),
  };
  return record;
}
