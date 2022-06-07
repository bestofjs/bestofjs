import { Link } from "react-router-dom";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import styled from "@emotion/styled";

import featuredProjects from "./featured-projects.json";
import "./vertical-timeline.css";
import "./vertical-timeline-element.css";
import { findProjectsByIds } from "selectors";
import { useSelector } from "containers/project-data-container";
import { ProjectTagGroup } from "components/tags/project-tag";
import { ProjectAvatar } from "components/core";

type Project = BestOfJS.Project & { date: Date; comments: string[] };

function useTimelineProjects() {
  const projects: BestOfJS.Project[] = useSelector(
    findProjectsByIds(featuredProjects.map(({ slug }) => slug))
  ).filter(Boolean);
  return featuredProjects
    .map(({ slug, date, comments }) => {
      const project: BestOfJS.Project | undefined = projects.find(
        (project) => project.slug === slug
      );
      if (!project) return null;
      return {
        comments: comments || [],
        date: date || new Date(project.created_at),
        ...project,
      };
    })
    .filter(Boolean);
}

export const Timeline = () => {
  const projects = useTimelineProjects();

  return (
    <Wrapper>
      <VerticalTimeline>
        {(projects as Project[]).map((project, index) => (
          <VerticalTimelineElement
            key={project.slug}
            date={dateFormat.format(new Date(project.date!))}
            iconStyle={{
              background: "var(--cardBackgroundColor)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 5,
            }}
            icon={<ProjectAvatar project={project} size={50} />}
          >
            <h4
              style={{
                fontSize: "1.5rem",
                fontWeight: "normal",
                display: "flex",
              }}
            >
              <div style={{ flexGrow: 1 }}>
                <Link to={`/projects/${project.slug}`}>{project.name}</Link>
              </div>
              <div
                data-testid="timeline-project-index"
                style={{ color: "#bb967c" }}
              >{`#${index + 1}`}</div>
            </h4>
            {project.comments.map((comment, index) => (
              <p key={index}>{comment}</p>
            ))}
            <div style={{ paddingTop: "1rem" }}>
              <span>Trend this month: </span>+{project.trends.monthly}☆ on
              GitHub
            </div>
            <div style={{ paddingTop: "1rem" }}>
              <ProjectTagGroup tags={project.tags.slice(0, 3)} />
            </div>
          </VerticalTimelineElement>
        ))}
      </VerticalTimeline>
    </Wrapper>
  );
};

const dateFormat = new Intl.DateTimeFormat("default", {
  year: "numeric",
  month: "long",
}); // E.g. "May 2022"

const Wrapper = styled.div`
  border: 3px solid white;
  border-radius: 5px;
  overflow-x: hidden;
`;
