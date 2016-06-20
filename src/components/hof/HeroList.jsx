import React from 'react'

import HeroCard from './HeroCard'
import AnonymousHero from './AnonymousHero'
import MainContent from '../common/MainContent'

export default ({ heroes = [], you, auth, onLogin, isHero, showDetails }) => (
  <MainContent>
    <h1>
      Hall of Fame
      <span style={{ color: '#aaa', marginLeft: 5 }}>
        ({heroes.length === 0 ? 'Loading...' : `${heroes.length} members` })
      </span>
    </h1>
    <div>
      Here are some of the greatest developers, authors and speakers of the JavaScript community.<br />
      It is like the basket-ball Hall of Fame... except they are all still in activity!
    </div>
    {false && heroes.map(hero => (
      <div>
        {'* '}
        {hero.name}
        {' '}
        https://github.com/{hero.login}
      </div>
    ))}
    <div className="hero-list" style={{ marginTop: '1em' }}>
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
          !isHero && <HeroCard
            hero={you}
            you
          />
        )}
    </div>
    </div>
  </MainContent>
)
