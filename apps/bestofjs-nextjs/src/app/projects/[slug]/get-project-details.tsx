export async function getProjectDetails(project: BestOfJS.Project) {
  const details = await fetchProjectDetailsData(project.full_name);
  return mergeProjectData(project, details);
}

type ProjectDetailsRawData = {
  npm: BestOfJS.PackageData;
  bundle: BestOfJS.BundleData;
  description: string;
  github: {
    contributor_count: number;
    commit_count: number;
    created_at: string;
  };
  timeSeries: BestOfJS.ProjectDetails["timeSeries"];
};

async function fetchProjectDetailsData(fullName: string) {
  const url = `https://bestofjs-serverless.vercel.app/api/project-details?fullName=${fullName}`;
  const options = {
    next: {
      revalidate: 60 * 60 * 24, // Revalidate every day to avoid showing stale data
      tags: ["project-details", fullName], // to be able to revalidate via API calls, on-demand
    },
  };
  const data = await fetch(url, options).then((res) => res.json());
  return data as ProjectDetailsRawData;
}

function mergeProjectData(
  project: BestOfJS.Project,
  details: ProjectDetailsRawData
) {
  const {
    npm,
    bundle,
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
    bundle,
    packageData: npm,
  } as BestOfJS.ProjectWithPackageDetails;
}
