import React from 'react'
import styled from 'styled-components'

import HeroCard from './HeroCard'
import AnonymousHero from './AnonymousHero'
import MainContent from '../common/MainContent'
import MoreHeroes from './MoreHeroes'

const Grid = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: -2rem 0 0 -2rem;
  > div {
    flex: 0 0 50%;
    padding: 2em 0 0 2em;
    display: flex;
  }
  @media (max-width: 550px) {
    flex-direction: column;
    > div {
      flex: 0 0 auto;
    }
  }
`

const HeroList = ({ heroes = [], you, auth, onLogin, isHero, showDetails }) => (
  <MainContent>
    <h1 style={{ marginBottom: '1rem' }}>JavaScript Hall of Fame</h1>
    <div style={{ marginBottom: '2rem' }}>
      Here are some of the greatest developers, authors and speakers of the
      JavaScript community.<br />
      It is like the basket-ball Hall of Fame... except they are all still in
      activity!
    </div>
    <Grid>
      {heroes.map(hero => (
        <div key={hero.username}>
          <HeroCard
            hero={hero}
            isCurrentUser={hero.username === auth.username}
            showDetails={showDetails}
          />
        </div>
      ))}
      <div>
        {auth.username === '' ? (
          <AnonymousHero onLogin={onLogin} />
        ) : (
          !isHero && <HeroCard hero={you} you />
        )}
      </div>
    </Grid>
    <MoreHeroes
      handleClick={onLogin}
      isLoggedin={auth.username !== ''}
      pending={auth.pending}
    />
  </MainContent>
)

export default HeroList
