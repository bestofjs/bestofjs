import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'

import MarkdownReadonly from '../../common/form/MarkdownReadonly'
import fromNow from '../../../helpers/fromNow'
import Button from '../../common/form/Button/Link'

const cardSection = css`
  border-top: 1px dashed rgb(203, 203, 203);
  padding: 1rem;
`

const Card = styled.div`
  margin-bottom: 2rem;
  background-color: white;
  border: 1px solid #cbcbcb;
`

const Header = styled.div`
  padding: 1rem;
`

const Title = styled.a`
  font-size: 1.5rem;
`

const Meta = styled.div`
  ${cardSection};
`

const Description = styled.div`
  ${cardSection};
`

const ActionBar = styled.div`
  text-align: center;
  ${cardSection};
`

const ProjectLinkCard = ({ project, link, editable }) => {
  return (
    <Card>
      <Header>
        <Title href={link.url} target="_blank" className="project-link-title">
          {link.title} <span className="octicon octicon-link-external" />
        </Title>
      </Header>
      <Description>
        <MarkdownReadonly comment={link.comment} />
      </Description>
      <Meta>
        Link added by{' '}
        <a
          href={`https://github.com/${link.createdBy}`}
          title="GitHub profile"
          target="_blank"
        >
          {link.createdBy}
        </a>{' '}
        {fromNow(link.createdAt)}
      </Meta>
      {editable && (
        <ActionBar>
          <Button
            className="btn mini button-outline"
            to={`/projects/${project.slug}/links/${link._id}/edit`}
          >
            <span className="octicon octicon-pencil" /> EDIT
          </Button>
        </ActionBar>
      )}
    </Card>
  )
}

ProjectLinkCard.propTypes = {
  project: PropTypes.object.isRequired,
  link: PropTypes.object.isRequired,
  editable: PropTypes.bool.isRequired
}

export default ProjectLinkCard
