import React from 'react'
import defaultOptions from './items'

export default ({ currentValue, onToggle, items = defaultOptions, category = '*' }) => (
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
          onClick={() => onToggle(item.value)}
        >
          {item.text}
        </div>
    ))}
  </div>
)
