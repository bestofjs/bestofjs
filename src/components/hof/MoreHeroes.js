import React from 'react'
import { Link } from 'react-router-dom'

const MoreHeroes = ({ handleClick, isLoggedin, pending }) => {
  return (
    <div className="no-card-container" style={{ marginTop: '2rem' }}>
      <h3 className="with-comment">Do you want more members ?</h3>
      {isLoggedin ? (
        <Link className="btn block button-outline" to="/requests/add-hero">
          <span className="octicon octicon-plus" />
          {' '}
          Suggest a new member
        </Link>
      ) : (
        <button
          className={`btn block button-outline${pending ? ' ui loading button' : ''}`}
          onClick={handleClick}
        >
          <span className="octicon octicon-mark-github" />
          {' '}
          Sign in with GitHub to suggest a new member
        </button>
      )}
    </div>
  )
}
export default MoreHeroes
