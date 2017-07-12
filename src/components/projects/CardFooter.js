import React from 'react'

const CardFooter = ({ belongsToMyProjects, onAdd, onRemove, pending }) => {
  const extraClassName = pending ? ' ui loading button' : 'button-outline'
  return (
    <div className="project-card-footer card-section">
      {belongsToMyProjects ? (
        <button
          className={`btn mini light ${extraClassName}`}
          onClick={onRemove}
          disabled={pending}
        >
          <span className="icon octicon octicon-dash" />
          REMOVE BOOKMARK
        </button>
      ) : (
        <button
          className={`btn mini ${extraClassName}`}
          onClick={onAdd}
          disabled={pending}
        >
          <span className="icon octicon octicon-plus" />
          ADD BOOKMARK
        </button>
      )}
    </div>
  )
}

export default CardFooter
