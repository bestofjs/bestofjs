import React from 'react'

import TagMenuItem from './TagMenuItem'

const TagMenu = React.createClass({
  shouldComponentUpdate () {
    return false
  },
  render () {
    return (
      <div className="tag-menu">
        {this.props.tags.map(tag =>
          <TagMenuItem
            tag={tag}
            key={tag.id}
            active={tag.id === this.props.selectedTag}
          />
         )}
      </div>
    )
  }
})
module.exports = TagMenu
