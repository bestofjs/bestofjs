import React from 'react'

import HeroCard from './HeroCard'

export default ({ heroes, auth, style }) => (
  <div className="hero-list" style={style}>
    {heroes.map(hero => (
      <div key={hero.username}>
        <HeroCard
          hero={hero}
          isCurrentUser={hero.username === auth.username}
        />
      </div>
    ))}
  </div>
)
