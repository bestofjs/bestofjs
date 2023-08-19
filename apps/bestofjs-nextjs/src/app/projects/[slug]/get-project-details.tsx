export async function getProjectDetails(project: BestOfJS.Project) {
  const details = await fetchProjectDetailsData(project.full_name);
  return mergeProjectData(project, details);
}

async function fetchProjectDetailsData(fullName: string) {
  const url = `https://bestofjs-serverless.vercel.app/api/project-details?fullName=${fullName}`;
  const options = {
    next: {
      revalidate: 60 * 60 * 24, // Revalidate every day to avoid showing stale data
      tags: ["project-details", fullName], // to be able to revalidate via API calls, on-demand
    },
  };
  return fetch(url, options).then((res) => res.json());
}

function mergeProjectData(project: BestOfJS.Project, details: any) {
  const {
    npm,
    bundle,
    packageSize,
    description,
    github: { contributor_count, commit_count, created_at },
    timeSeries,
  } = details;

  return {
    ...project,
    description,
    timeSeries,
    commit_count,
    contributor_count,
    created_at,
    npm,
    bundle,
    packageSize,
  } as BestOfJS.ProjectDetails;
}
