import React, { PropTypes } from 'react'
import Link from 'react-router/lib/Link'

const TagMenuItem = React.createClass({
  propTypes: {
    tag: PropTypes.object,
    active: PropTypes.bool
  },
  render () {
    const { tag, active } = this.props
    return (
      <Link
        to={'/tags/' + tag.id}
        className={'tag-menu-item' + (active ? ' active' : '')}
      >
        {tag.name}
        <span className="counter">{tag.counter}</span>
      </Link>
    )
  }
})
module.exports = TagMenuItem
