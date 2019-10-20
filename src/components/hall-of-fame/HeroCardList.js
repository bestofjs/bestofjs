import React from 'react'

import HeroCard from './HeroCard'

const HeroCardList = ({ heroes, auth, style, showDetails }) => (
  <div className="hero-list" style={style}>
    {heroes.map(hero => (
      <div key={hero.username}>
        <HeroCard
          hero={hero}
          isCurrentUser={hero.username === auth.username}
          showDetails={showDetails}
        />
      </div>
    ))}
  </div>
)

export default HeroCardList
