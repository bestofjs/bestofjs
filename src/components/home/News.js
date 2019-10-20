import React from 'react'
import PropTypes from 'prop-types'
import fromNow from '../../helpers/fromNow'
import SectionTitle from './SectionTitle'

const News = ({ children, date, title }) => {
  return (
    <div>
      <SectionTitle>
        <span
          className="mega-octicon octicon-megaphone"
          style={{ color: '#fa9e59' }}
        />{' '}
        <span>{title}</span>
        <span
          className="text-secondary"
          style={{ fontSize: '1rem', marginLeft: '.5rem' }}
        >
          {fromNow(date)}
        </span>
      </SectionTitle>
      <p>{children}</p>
    </div>
  )
}

News.propTypes = {
  date: PropTypes.object.isRequired
}

export default News
