import React from 'react'
import defaultOptions from './items'

export default ({ currentValue, onToggle, items = defaultOptions, category = '*' }) => {
  const onChange = (e) => onToggle(e.target.value)
  return (
    <div
      className="hot-filter-combobox card-row inner project-filter-combobox"
    >
      <div style={{ paddingRight: '.5rem' }}>Sort by</div>
      <select
        style={{
          fontSize: 'inherit',
          color: 'inherit',
          padding: 4,
          height: 'auto'
        }}
        value={currentValue}
        onChange={onChange}
      >
        {items
          .filter(item => category === '*' || item.category === category)
          .map(item => (
            <option
              value={item.value}
              key={item.value}
            >
              {item.comment}
            </option>
          ))}
      </select>
    </div>
  )
}
