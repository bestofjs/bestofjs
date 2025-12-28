import path from "node:path";
import fs from "fs-extra";
import pMap from "p-map";
import { z } from "zod";

import { generateProjectDefaultSlug, ProjectService } from "@repo/db/projects";

import { createTask } from "@/task-runner";

import {
  type RisingStarsEntry,
  risingStarsEntrySchema,
} from "./rising-stars-types";

export const cleanupRisingStars = createTask({
  name: "cleanup-rising-stars",
  description: "Build Rising Stars data",
  flags: {
    year: { type: Number, default: 2024 },
  },
  schema: z.object({ year: z.number() }),
  run: async (context, flags) => {
    const { dryRun, logger, saveJSON } = context;
    const { year } = flags;
    const service = new ProjectService(context.db);

    const filepath = path.resolve(
      process.cwd(),
      "..",
      "javascript-risingstars",
      "data",
      `${year}`,
      "projects.json",
    );
    const rawData = await fs.readJSON(filepath);
    const inputSchema = z.object({ projects: z.array(risingStarsEntrySchema) });
    const data = inputSchema.parse(rawData);
    const projects = data.projects;

    let errors = 0;
    const processProject = async (project: RisingStarsEntry) => {
      const data = await getProjectData(project);
      if (!data) return project;
      const { slug, logo } = data;
      return {
        ...project,
        ...(slug && { slug }),
        ...(logo && { icon: logo }),
      };
    };
    const updatedProjects = await pMap(projects, processProject, {
      concurrency: 1,
    });

    if (!dryRun) {
      saveJSON({ ...rawData, projects: updatedProjects }, "rising-stars.json");
    }

    return { data: null, meta: { processed: projects.length, errors } };

    async function getProjectData(project: RisingStarsEntry) {
      const slug = project.slug || generateProjectDefaultSlug(project.name);
      const foundRecord = await service.getProjectBySlug(slug);
      if (!foundRecord) {
        logger.warn("Record not found", slug);
        errors++;
        return null;
      } else {
        const logo = foundRecord?.logo;
        return { slug, logo };
      }
    }
  },
});
