import React from 'react'
import Toggle from 'react-toggled'

const NpmSection = ({ project }) =>
  <section className="inner npm-section">
    <a
      href={`https://www.npmjs.com/package/${project.npm}`}
      style={{ display: 'flex', alignItems: 'center', marginBottom: '.5rem' }}
    >
      <img
        src="https://s3-us-west-2.amazonaws.com/svgporn.com/logos/npm.svg"
        alt="NPM"
        className="npm"
        height="16"
        width="40.95"
        style={{ marginRight: '.25rem' }}
      />
      <span style={{ marginRight: '.25rem' }}>
        {project.npm}
      </span>
      <span className="version text-secondary">
        {project.version}
      </span>
    </a>
    <Dependencies project={project} />
  </section>

const Dependencies = ({ project }) => {
  const count = project.dependency_count
  if (count === 0) return <span>No dependencies</span>
  return project.dependencies
    ? <DependencyList dependencies={project.dependencies} />
    : <span>Loading...</span>
}

const DependencyList = ({ dependencies }) =>
  <Toggle>
    {({ on, getTogglerProps }) =>
      <div className="dependencies">
        <a className="toggler" {...getTogglerProps()}>
          <span
            className={`octicon octicon-triangle-${on ? 'down' : 'right'} icon`}
          />{' '}
          {dependencies.length}
          {' dependencies'}
        </a>
        {!on && <DependencyListPreview dependencies={dependencies} />}
        <div>
          {on &&
            <DependencyFullList
              togglerProps={getTogglerProps()}
              dependencies={dependencies}
            />}
        </div>
      </div>}
  </Toggle>

const DependencyListPreview = ({ dependencies }) =>
  <span className="inline-list" style={{ marginLeft: '.5rem' }}>
    {dependencies.map(packageName =>
      <a
        key={packageName}
        href={`https://npm.im/${packageName}`}
        target="_blank"
      >
        {packageName}
      </a>
    )}
  </span>

const DependencyFullList = ({ dependencies }) =>
  <ul className="block-list">
    {dependencies.map(packageName =>
      <li key={packageName}>
        <a key={packageName} href={`https://npm.im/${packageName}`}>
          {packageName}
        </a>
      </li>
    )}
  </ul>

export default NpmSection
