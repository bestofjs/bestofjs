import styled from "@emotion/styled";
import { Link as RouterLink } from "react-router-dom";
import numeral from "numeral";
import { GoMarkGithub, GoBookmark, GoHome } from "react-icons/go";

import {
  Box,
  IconButton,
  Link,
  ProjectAvatar,
  getDeltaByDay,
} from "components/core";
import { AuthContainer } from "containers/auth-container";
import { DownloadCount, StarDelta, StarTotal } from "components/core/project";
import { ProjectTagGroup } from "components/tags/project-tag";
import { fromNow } from "helpers/from-now";

type Props = {
  projects: BestOfJS.Project[];
  footer?: React.ReactNode;
  showDetails?: boolean;
  metricsCell?: (project: BestOfJS.Project) => React.ReactNode;
};

export const ProjectTable = ({ projects, footer, ...otherProps }: Props) => {
  return (
    <div className="table-container">
      <Table>
        <tbody>
          {projects.map((project, index) => {
            if (!project) return null;
            return (
              <ProjectTableRow
                key={project.full_name}
                project={project}
                {...otherProps}
              />
            );
          })}
        </tbody>
        {footer && (
          <tfoot>
            <FooterRow>
              <Cell colSpan={5}>{footer}</Cell>
            </FooterRow>
          </tfoot>
        )}
      </Table>
    </div>
  );
};

type RowProps = {
  project: BestOfJS.Project;
  showDetails?: boolean;
  metricsCell?: (project: BestOfJS.Project) => React.ReactNode;
};
const ProjectTableRow = ({
  project,
  showDetails = true,
  metricsCell,
}: RowProps) => {
  const { isLoggedIn, addBookmark, removeBookmark } =
    AuthContainer.useContainer();
  const path = `/projects/${project.slug}`;

  const toggleBookmark = () => {
    project.isBookmark ? removeBookmark(project) : addBookmark(project);
  };

  return (
    <Row data-testid="project-card">
      <Cell width="50px">
        <Link as={RouterLink} to={path}>
          <ProjectAvatar project={project} size={50} />
        </Link>
      </Cell>

      <Cell pl={{ base: 4, md: 2 }}>
        <ProjectName>
          <MainLink as={RouterLink} to={path} mr={2}>
            {project.name}
          </MainLink>
          <IconButton
            as="a"
            href={project.repository}
            rel="noopener noreferrer"
            target="_blank"
            icon={<GoMarkGithub size={20} />}
            aria-label="GitHub repository"
            variant="ghost"
            isRound
            color="var(--textSecondaryColor)"
          />
          {project.url && (
            <IconButton
              as="a"
              href={project.url}
              rel="noopener noreferrer"
              target="_blank"
              icon={<GoHome size={20} />}
              aria-label="Project's homepage"
              variant="ghost"
              isRound
              color="var(--textSecondaryColor)"
            />
          )}
          {isLoggedIn && (
            <IconButton
              onClick={toggleBookmark}
              icon={<GoBookmark size={20} />}
              aria-label={
                project.isBookmark ? "Remove bookmark" : "Add bookmark"
              }
              variant="ghost"
              isRound
              color={
                project.isBookmark
                  ? "var(--iconColor)"
                  : "var(--textSecondaryColor)"
              }
            />
          )}
        </ProjectName>
        <ProjectDescription>
          {project.description}
          <RepoInfo>
            Updated {fromNow(project.pushed_at)},{" "}
            {formatNumber(project.contributor_count)} contributors
          </RepoInfo>
        </ProjectDescription>
        <div>
          <ProjectTagGroup tags={project.tags} />
        </div>
      </Cell>

      {showDetails && (
        <ContributorCountCell>
          <div>Pushed {fromNow(project.pushed_at)}</div>
          {project.contributor_count && (
            <div>{formatNumber(project.contributor_count)} contributors</div>
          )}
          <>Created {fromNow(project.created_at)}</>
        </ContributorCountCell>
      )}

      {metricsCell && <StarNumberCell>{metricsCell(project)}</StarNumberCell>}
    </Row>
  );
};

export const ProjectScore = ({
  project,
  sortOptionId,
}: {
  project: BestOfJS.Project;
  sortOptionId: string;
}) => {
  const showDelta = ["daily", "weekly", "monthly", "yearly"].includes(
    sortOptionId
  );
  const showDownloads = sortOptionId === "monthly-downloads";

  if (showDelta) {
    const value = getDeltaByDay(sortOptionId)(project);
    if (value === undefined) return null;
    return <StarDelta value={value} average={sortOptionId !== "daily"} />;
  }

  if (showDownloads) {
    return <DownloadCount value={project.downloads} />;
  }

  return <StarTotal value={project.stars} />;
};

const breakpoint = 800;

const Table = styled.table`
  border-spacing: 0;
  width: 100%;
`;

const Row = styled.tr`
  td {
    border-top: 1px dashed var(--boxBorderColor);
  }
  &:last-child td {
    border-bottom: 1px dashed var(--boxBorderColor);
  }
`;

const FooterRow = styled.tr`
  td {
    border-bottom: 1px dashed var(--boxBorderColor);
    text-align: center;
    a {
      display: block;
      font-family: var(--buttonFontFamily);
    }
  }
`;

const Cell = (props) => (
  <Box as="td" py={4} px={2} bg="var(--cardBackgroundColor)" {...props} />
);

const MainLink = styled(Link)`
  display: flex;
  align-items: center;
  img {
    margin-right: 1rem;
  }
  font-family: var(--buttonFontFamily);
`;

const ContributorCountCell = styled(Cell)`
  width: 170px;
  font-size: 0.875rem;
  @media (max-width: 799px) {
    display: none;
  }
  div {
    margin-bottom: 0.5rem;
  }
`;

const StarNumberCell = styled(Cell)`
  text-align: center;
  width: 85px;
`;

const ProjectName = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  font-family: var(--linkFontFamily);
`;

const ProjectDescription = styled.div`
  font-size: 0.875rem;
  margin-top: 0.125rem;
  margin-bottom: 0.75rem;
`;

const RepoInfo = styled.div`
  font-size: 0.875rem;
  margin-top: 0.5rem;
  @media (min-width: ${breakpoint}px) {
    display: none;
  }
`;

const formatNumber = (number) => numeral(number).format("a");
