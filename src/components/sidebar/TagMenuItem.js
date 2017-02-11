import React, { PropTypes } from 'react'
import Link from 'react-router/lib/Link'
// import sortItems from '../ProjectFilter/items'

// function getUrl (ui) {
//   const currentSortOption = ui.hotFilter
//   console.info(currentSortOption);
//   const currentSortItem = sortItems.find(item => item.value === currentSortOption)
//   if (!currentSortItem) return null
//   return `/${currentSortItem.url}`
// }

const TagMenuItem = React.createClass({
  propTypes: {
    tag: PropTypes.object,
    active: PropTypes.bool
  },
  render () {
    const { tag, active } = this.props
    // const url = `/tags/${tag.id}${getUrl(ui)}`
    const url = `/tags/${tag.id}`
    return (
      <Link
        to={url}
        className={'tag-menu-item' + (active ? ' active' : '')}
        activeClassName="active"
      >
        {tag.name}
        <span className="counter">{tag.counter}</span>
      </Link>
    )
  }
})
export default TagMenuItem
