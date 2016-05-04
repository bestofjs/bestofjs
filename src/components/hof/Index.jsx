import React from 'react'

import HeroCard from './HeroCard'
import MainContent from '../common/MainContent'

export default ({ heroes = [], you }) => (
  <MainContent>
    <h1>Hall of Fame</h1>
    <p>
      Some of the greatest developers of the JavaScript community.<br />
      Like the basket-ball Hall of fame... except they are all in activity!
    </p>
    {false && heroes.map(hero => (
      <div>
        {'* '}
        {hero.name}
        {' '}
        https://github.com/{hero.login}
      </div>
    ))}
    <div className="hero-list" style={{ marginTop: '1.5em' }}>
      {heroes.map(hero => (
        <HeroCard
          key={hero.username}
          hero={hero}
        />
      ))}
      <HeroCard hero={you} />
    </div>
  </MainContent>
)
