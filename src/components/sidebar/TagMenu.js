import React from 'react'

import TagMenuItem from './TagMenuItem'

const TagMenu = React.createClass({
  // shouldComponentUpdate () {
  //   return false
  // },
  render () {
    const { selectedTag, ui } = this.props
    return (
      <div className="tag-menu">
        {this.props.tags.map(tag =>
          <TagMenuItem
            tag={tag}
            key={tag.id}
            active={tag.id === selectedTag}
            ui={ui}
          />
         )}
      </div>
    )
  }
})
export default TagMenu
