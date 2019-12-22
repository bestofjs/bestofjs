import React from 'react'

import { MainContent } from '../core'
import MoreHeroes from './MoreHeroes'
import HallOfFameMemberList from './HallOfFameMemberList'

const HallOfFame = props => {
  const { onLogin, auth } = props
  return (
    <MainContent>
      <h1 style={{ marginBottom: '1rem' }}>JavaScript Hall of Fame</h1>
      <div style={{ marginBottom: '2rem' }}>
        Here are some of the greatest developers, authors and speakers of the
        JavaScript community.
        <br />
        It is like the basket-ball Hall of Fame... except they are all still in
        activity!
      </div>
      <HallOfFameMemberList {...props} />
      <MoreHeroes
        handleClick={onLogin}
        isLoggedin={auth.username !== ''}
        pending={auth.pending}
      />
    </MainContent>
  )
}

export default HallOfFame
