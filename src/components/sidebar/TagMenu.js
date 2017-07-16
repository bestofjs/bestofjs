import React from 'react'

import TagMenuItem from './TagMenuItem'

class TagMenu extends React.PureComponent {
  render() {
    const { tags, selectedTag } = this.props
    return (
      <div className="tag-menu">
        {tags.map(tag =>
          <TagMenuItem tag={tag} key={tag.id} active={tag.id === selectedTag} />
        )}
      </div>
    )
  }
}

export default TagMenu
