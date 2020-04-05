import React from 'react'

import Toggle from 'react-toggled'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useSelector } from 'react-redux'

import { StarTotal } from '../../core/project'
import { ExternalLink } from '../../core/typography'
import { npmProjects } from '../../../selectors'
import ExpandableSection from './ExpandableSection'
import DependencyTable from './DependencyTable'

const DependenciesContainer = styled.div`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  .inline-list > *:not(:last-child) {
    margin-right: 0.5rem;
  }
`

const Dependencies = ({ project }) => {
  const { dependencies } = project.npm
  if (!dependencies) return <span>Loading dependencies...</span>
  const count = dependencies.length
  if (count === 0) return <span>No dependencies</span>
  return <DependencyList dependencies={dependencies} />
}

const DependencyList = ({ dependencies }) => (
  <Toggle>
    {({ on, getTogglerProps }) => (
      <DependenciesContainer>
        <ExpandableSection on={on} getTogglerProps={getTogglerProps}>
          {dependencies.length}
          {' dependencies'}
        </ExpandableSection>
        {!on && <DependencyListPreview dependencies={dependencies} />}
        <div>
          {on && (
            <DependencyFullList
              togglerProps={getTogglerProps()}
              packageNames={dependencies}
            />
          )}
        </div>
      </DependenciesContainer>
    )}
  </Toggle>
)

const DependencyListPreview = ({ dependencies }) => (
  <span className="inline-list" style={{ marginLeft: '.5rem' }}>
    {dependencies.map(packageName => (
      <span className="text-secondary" key={packageName}>
        {packageName}
      </span>
    ))}
  </span>
)

function useFindProjectsByPackageName({ packageNames }) {
  const projects = useSelector(npmProjects)
  const packages = packageNames.map(packageName => ({
    name: packageName,
    project: projects.find(project => project.packageName === packageName)
  }))
  return packages
}

const DependencyFullList = ({ packageNames }) => {
  const packages = useFindProjectsByPackageName({ packageNames })

  return (
    <DependencyTable className="block-list">
      <thead>
        <tr>
          <td>Package on npm</td>
          <td>
            Project on <i>Best of JavaScript</i>
          </td>
        </tr>
      </thead>
      <tbody>
        {packages.map(npmPackage => (
          <tr key={npmPackage.name}>
            <td>
              <ExternalLink url={`https://npm.im/${npmPackage.name}`}>
                {npmPackage.name}
              </ExternalLink>
            </td>
            <td>
              {npmPackage.project ? (
                <span>
                  <Link
                    to={`/projects/${npmPackage.project.slug}`}
                    className="text-secondary"
                  >
                    {npmPackage.project.name}{' '}
                    <StarTotal value={npmPackage.project.stars} icon />
                  </Link>
                  <span className="text-secondary" />
                </span>
              ) : (
                <span style={{ color: '#ccc' }}>N/A</span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </DependencyTable>
  )
}

export default Dependencies
