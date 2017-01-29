import React from 'react'
import { Link } from 'react-router'
import items from './items'
const trendingOptions = items.filter(option => option.category === 'trend')
const popularOption = items[0]
const defaultTrendingOption = trendingOptions[0]

const Tabs = ({ rootUrl, currentValue }) => {
  const currentItem = items.find(item => item.value === currentValue)
  return (
    <div style={{marginBottom: '2rem'}}>
      <div className="project-sort-tabs-level1">
        <div className={`${currentValue === 'total' ? 'on' : 'off'}`}>
          <Link
            to={`${rootUrl}/${popularOption.url}`}
          >
            <span className="mega-octicon octicon-star icon" />
            POPULAR
          </Link>
        </div>
        <div className={`${currentItem.category === 'trend' ? 'on' : 'off'}`}>
          <Link
            to={`${rootUrl}/${defaultTrendingOption.url}`}
          >
            <span className="mega-octicon octicon-flame icon" />
            TRENDING
          </Link>
        </div>
      </div>
      {currentItem.category === 'trend' && <div className="project-sort-tabs-level2">
        {trendingOptions.map(item => (
          <Link
            key={item.value}
            className={`${currentValue === item.value ? 'on' : 'off'}`}
            to={`${rootUrl}/${item.url}`}
          >
            {item.text}
          </Link>
        ))}
      </div>}
    </div>
  )
}

export default Tabs
