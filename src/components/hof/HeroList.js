import React from 'react'

import HeroCard from './HeroCard'
import AnonymousHero from './AnonymousHero'
import MainContent from '../common/MainContent'
import MoreHeroes from './MoreHeroes'

const HeroList = ({ heroes = [], you, auth, onLogin, isHero, showDetails }) =>
  <MainContent>
    <h1 style={{ marginBottom: '1rem' }}>JavaScript Hall of Fame</h1>
    <div style={{ marginBottom: '2rem' }}>
      Here are some of the greatest developers, authors and speakers of the
      JavaScript community.<br />
      It is like the basket-ball Hall of Fame... except they are all still in
      activity!
    </div>
    <div className="hero-list">
      {heroes.map(hero =>
        <div key={hero.username}>
          <HeroCard
            hero={hero}
            isCurrentUser={hero.username === auth.username}
            showDetails={showDetails}
          />
        </div>
      )}
      <div>
        {auth.username === ''
          ? <AnonymousHero onLogin={onLogin} />
          : !isHero && <HeroCard hero={you} you />}
      </div>
    </div>
    <MoreHeroes
      handleClick={onLogin}
      isLoggedin={auth.username !== ''}
      pending={auth.pending}
    />
  </MainContent>

export default HeroList
