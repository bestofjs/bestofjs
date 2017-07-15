import React from 'react'
import { Link } from 'react-router-dom'

import MainContent from '../components/common/MainContent'

const NoMatch = () =>
  <MainContent style={{ textAlign: 'center' }}>
    <p>Sorry, page not found!</p>
    <Link to="/">Go to Home</Link>
  </MainContent>

export default NoMatch
