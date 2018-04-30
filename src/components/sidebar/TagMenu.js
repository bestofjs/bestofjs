import React from 'react'
import styled from 'styled-components'

import TagMenuItem from './TagMenuItem'

const sidebarBgColor = '#421729'

const Div = styled.div`
  background-color: ${sidebarBgColor};
`

class TagMenu extends React.PureComponent {
  render() {
    const { tags, selectedTag } = this.props
    return (
      <Div>
        {tags.map(tag => (
          <TagMenuItem tag={tag} key={tag.id} active={tag.id === selectedTag} />
        ))}
      </Div>
    )
  }
}

export default TagMenu
