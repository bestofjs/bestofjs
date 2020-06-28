import React from 'react'

import fromNow from '../../helpers/fromNow'
import { Section } from '../core/section'

export const News = ({ children, title, date, ...props }) => {
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

export default News
