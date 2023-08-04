export async function getProjectDetails(project: BestOfJS.Project) {
  const details = await fetchProjectDetailsData(project.full_name);
  return mergeProjectData(project, details);
}

async function fetchProjectDetailsData(fullName: string) {
  const url = `https://bestofjs-serverless.vercel.app/api/project-details?fullName=${fullName}`;
  return fetch(url).then((r) => r.json());
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
