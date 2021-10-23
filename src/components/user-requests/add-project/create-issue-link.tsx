import React from "react";

import { ExternalLink } from "../../core";
import getApi from "../../../api/config";

const templates = {
  ADD_PROJECT: "add-a-project-to-best-of-javascript.md",
  ADD_HALL_OF_FAME_MEMBER: "add-a-member-to-the-hall-of-fame.md",
};

const getCreateIssueURL = (template) => {
  const repo = getApi("ISSUES_REPO");

  return `https://github.com/${repo}/issues/new?template=${template}`;
};

export const addProjectURL = getCreateIssueURL(templates.ADD_PROJECT);

export const CreateIssueLink = ({
  children,
  type,
  ...props
}: {
  className?: string;
  style?: any;
  children: any;
  type: string;
}) => {
  const template = templates[type];
  const url = getCreateIssueURL(template);

  return (
    <ExternalLink url={url} {...props}>
      {children}
    </ExternalLink>
  );
};
