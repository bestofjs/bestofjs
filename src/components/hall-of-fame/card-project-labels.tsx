import React from "react";
import { Link } from "react-router-dom";

import { Button, Wrap, WrapItem } from "components/core";

export const CardProjectLabels = ({ projects }) => {
  const validProjects = projects.filter((project) => !!project);
  if (validProjects.length === 0) return null;

  return (
    <div className="inner">
      <Wrap>
        {validProjects.map((project) => (
          <WrapItem key={project.slug}>
            <Button
              as={Link}
              to={`/projects/${project.slug}`}
              variant="outline"
              colorScheme="orange"
              size="sm"
            >
              {project.name}
            </Button>
          </WrapItem>
        ))}
      </Wrap>
    </div>
  );
};
