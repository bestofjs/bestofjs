import React from 'react'
import PropTypes from 'prop-types'

import { Grid, Cell } from '../core'
import TagLabel from './TagLabel'

const TagGroup = ({ tags, ...otherProps }) => {
  return (
    <Grid>
      {tags.map(tag => (
        <Cell key={tag.id}>
          <TagLabel tag={tag} {...otherProps} />
        </Cell>
      ))}
    </Grid>
  )
}

TagGroup.propTypes = {
  tags: PropTypes.array.isRequired
}

export default TagGroup
