import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import TagLabel from './TagLabel'

const gutter = '1rem'

const Grid = styled.div`
  margin-top: -${gutter};
  margin-left: -${gutter};
`
const Cell = styled.div`
  display: inline-block;
  padding-top: ${gutter};
  padding-left: ${gutter};
`

const TagGroup = ({ tags }) => {
  return (
    <Grid>
      {tags.map(tag => (
        <Cell key={tag.id}>
          <TagLabel tag={tag} />
        </Cell>
      ))}
    </Grid>
  )
}

TagGroup.propTypes = {
  tags: PropTypes.array.isRequired
}

export default TagGroup
