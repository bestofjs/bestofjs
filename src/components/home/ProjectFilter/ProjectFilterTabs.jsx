import React from 'react'
import { Link } from 'react-router'
import defaultOptions from './items'

export default ({ tag, currentValue, onToggle, items = defaultOptions, category = '*' }) => (
  <div
    className="hot-filter-menu project-filter-tabs"
  >
    {items
      .filter(item => category === '*' || item.category === category)
      .map(item => (
        <div
          key={item.value}
          data-balloon={`Sort by ${item.comment}`}
          className={`hot-filter-menu-item ${currentValue === item.value ? 'on' : 'off'}`}
          onClickXX={() => onToggle(item.value)}
        >
          <Link to={`/tags/${tag}/${item.url}`}>{item.text}</Link>
        </div>
    ))}
  </div>
)
