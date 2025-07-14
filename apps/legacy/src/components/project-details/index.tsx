import { ErrorBoundary, ErrorCard } from "components/core";

import { GitHubRepoInfo } from "./github-repo-info";
import { NpmCard } from "./npm-card";
import { ReadmeCard } from "./readme-card";

type Props = {
  project: BestOfJS.ProjectDetails;
  isLoading: boolean;
  error: Error;
};
const ProjectDetailsMainTab = (props: Props) => {
  const { project, isLoading, error } = props;

  return (
    <>
      <ErrorBoundary
        fallback={<ErrorCard>Unable to display GitHub data</ErrorCard>}
      >
        <GitHubRepoInfo {...props} />
      </ErrorBoundary>
      {project.packageName && (
        <ErrorBoundary
          fallback={<ErrorCard>Unable to display package data</ErrorCard>}
        >
          <NpmCard {...props} isLoading={isLoading} error={error} />
        </ErrorBoundary>
      )}
      <ErrorBoundary
        fallback={<ErrorCard>Unable to display project's README</ErrorCard>}
      >
        <ReadmeCard {...props} />
      </ErrorBoundary>
    </>
  );
};

export default ProjectDetailsMainTab;
