import React from 'react';

import ItemHeader from '../ProjectView/ItemHeader';
import Comment from '../common/form/MarkdownReadonly';
import CardProjectLabels from '../common/CardProjectLabels'

export default ({ link, project, editable, showProjects }) => {
  return (
    <div className="link-card">
      <div className="header">
        <ItemHeader
          item={link}
          editable={ editable }
          editLinkTo={ `/projects/${project.id}/links/${link._id}/edit` }
        />
      </div>
      <a className="header" href={link.url} target="_blank">
        <div className="title">{link.title}</div>
        <div className="url">{link.url}</div>
      </a>

      {showProjects && (
        <CardProjectLabels
          projects={link.projects}
        />
      )}

      <div className="inner">
        <Comment comment={link.comment} emptyText="(No description)" />
      </div>
    </div>
  );
};
