import React from 'react'
import { Link } from 'react-router-dom'

import TabLevel1 from './TabLevel1'
import TabLevel2 from './TabLevel2'
import items from './items'

const trendingOptions = items.filter(option => option.category === 'trend')
const popularOption = items[0]
const defaultTrendingOption = trendingOptions[0]

const Tabs = ({ rootUrl, currentValue }) => {
  const currentItem = items.find(item => item.value === currentValue)
  return (
    <div style={{ marginBottom: '2rem' }}>
      <TabLevel1>
        <div className={`${currentValue === 'total' ? 'on' : 'off'}`}>
          <Link to={`${rootUrl}/${popularOption.url}`}>
            <span className="mega-octicon octicon-star icon" />
            POPULAR
          </Link>
        </div>
        <div className={`${currentItem.category === 'trend' ? 'on' : 'off'}`}>
          <Link to={`${rootUrl}/${defaultTrendingOption.url}`}>
            <span className="mega-octicon octicon-flame icon" />
            TRENDING
          </Link>
        </div>
      </TabLevel1>
      {currentItem.category === 'trend' && (
        <TabLevel2>
          {trendingOptions.map(item => (
            <Link
              key={item.value}
              className={`${currentValue === item.value ? 'on' : 'off'}`}
              to={`${rootUrl}/${item.url}`}
            >
              {item.text}
            </Link>
          ))}
        </TabLevel2>
      )}
    </div>
  )
}

export default Tabs
