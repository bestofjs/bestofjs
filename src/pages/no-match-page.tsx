import React from 'react'
import { Link } from 'react-router-dom'

import { MainContent } from 'components/core'

export const NoMatchPage = () => (
  <MainContent style={{ textAlign: 'center' }}>
    <p>Sorry, page not found!</p>
    <Link to="/">Go to Home</Link>
  </MainContent>
)
