import React from 'react'
import PropTypes from 'prop-types'

import fromNow from '../../helpers/fromNow'
import { Section } from '../core/section'

const News = ({ children, title, date, ...props }) => {
  return (
    <Section {...props}>
      <Section.Header icon="megaphone">
        <Section.Title>{title}</Section.Title>
        <Section.SubTitle>PUBLISHED {fromNow(date)}</Section.SubTitle>
      </Section.Header>
      {children}
    </Section>
  )
}

News.propTypes = {
  date: PropTypes.object.isRequired
}

export default News
