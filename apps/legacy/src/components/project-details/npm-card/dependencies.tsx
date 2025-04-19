import Toggle from "react-toggled";
import { Link as RouterLink } from "react-router-dom";
import styled from "@emotion/styled";

import { useSelector } from "containers/project-data-container";
import { StarTotal } from "components/core/project";
import { Link } from "components/core";
import { ExternalLink } from "components/core/typography";
import { ExternalLinkIcon } from "components/core/icons";
import { npmProjects } from "selectors";
import { ExpandableSection } from "./expandable-section";
import { DependencyTable } from "./dependency-table";

const DependenciesContainer = styled.div`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  .inline-list > *:not(:last-child) {
    margin-right: 0.5rem;
  }
`;

export const Dependencies = ({ project }) => {
  const { dependencies } = project.npm;
  if (!dependencies) return <span>Loading dependencies...</span>;
  const count = dependencies.length;
  if (count === 0) return <span>No dependencies</span>;
  return <DependencyList dependencies={dependencies} />;
};

const DependencyList = ({ dependencies }) => (
  <Toggle>
    {({ on, getTogglerProps }) => (
      <DependenciesContainer>
        <ExpandableSection on={on} getTogglerProps={getTogglerProps}>
          {`${dependencies.length} dependencies`}
          {!on && <DependencyListPreview dependencies={dependencies} />}
        </ExpandableSection>
        {on && <DependencyFullList packageNames={dependencies} />}
      </DependenciesContainer>
    )}
  </Toggle>
);

const DependencyListPreview = ({ dependencies }) => (
  <span className="inline-list" style={{ marginLeft: ".5rem" }}>
    {dependencies.map((packageName) => (
      <span className="text-secondary" key={packageName}>
        {packageName}
      </span>
    ))}
  </span>
);

function useFindProjectsByPackageName({ packageNames }) {
  const projects = useSelector(npmProjects);
  const packages = packageNames.map((packageName) => ({
    name: packageName,
    project: projects.find((project) => project.packageName === packageName),
  }));
  return packages;
}

const DependencyFullList = ({ packageNames }) => {
  const packages = useFindProjectsByPackageName({ packageNames });

  return (
    <DependencyTable className="block-list">
      <thead>
        <tr>
          <td>Package on NPM</td>
          <td>
            Project on <i>Best of JS</i>
          </td>
        </tr>
      </thead>
      <tbody>
        {packages.map((npmPackage) => (
          <tr key={npmPackage.name}>
            <td>
              <ExternalLink url={`https://npm.im/${npmPackage.name}`}>
                {npmPackage.name}
                <ExternalLinkIcon />
              </ExternalLink>
            </td>
            <td>
              {npmPackage.project ? (
                <span>
                  <Link
                    as={RouterLink}
                    to={`/projects/${npmPackage.project.slug}`}
                  >
                    {npmPackage.project.name}{" "}
                  </Link>
                  <StarTotal value={npmPackage.project.stars} />
                  <span className="text-secondary" />
                </span>
              ) : (
                <span className="text-muted">N/A</span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </DependencyTable>
  );
};
