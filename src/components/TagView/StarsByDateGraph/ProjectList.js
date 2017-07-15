/* eslint-disable */

/* WORK in PROGRESS, COMING SOON! */

import React from 'react'
import Stars from '../../common/utils/Stars'

const Table = ({ projects }) => {
  return (
    <div style={{ padding: '1rem' }}>
      <table style={{ width: '100%' }}>
        <tbody>
          {projects.map((project, i) =>
            <Table.Row project={project} key={project.slug} index={i + 1} />
          )}
        </tbody>
      </table>
    </div>
  )
}

Table.Row = ({ project, index }) =>
  <tr>
    <td
      style={{
        backgroundColor: project.color,
        color: 'white',
        textAlign: 'right'
      }}
    >
      #{index}
    </td>
    <td>
      {project.name}
    </td>
    <td>
      <Stars value={project.stars} />
    </td>
  </tr>

export default Table
