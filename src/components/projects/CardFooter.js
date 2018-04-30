import React from 'react'
import Button from '../common/form/Button'
import ProjectCardSection from './ProjectCardSection'

const CardFooter = ({ belongsToMyProjects, onAdd, onRemove, pending }) => {
  const extraClassName = pending ? ' ui loading button' : 'button-outline'
  return (
    <ProjectCardSection
      className="project-card-footer card-section"
      style={{ textAlign: 'center' }}
    >
      {belongsToMyProjects ? (
        <Button
          className={`btn mini light ${extraClassName}`}
          onClick={onRemove}
          disabled={pending}
        >
          <span className="icon octicon octicon-dash" />
          REMOVE BOOKMARK
        </Button>
      ) : (
        <Button
          className={`btn mini ${extraClassName}`}
          onClick={onAdd}
          disabled={pending}
        >
          <span className="icon octicon octicon-plus" />
          ADD BOOKMARK
        </Button>
      )}
    </ProjectCardSection>
  )
}

export default CardFooter
