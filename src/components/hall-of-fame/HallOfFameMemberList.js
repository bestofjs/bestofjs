import React from 'react'
import styled from 'styled-components'

import HeroCard from './HeroCard'

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

const HallOfFameMemberList = ({ heroes = [], showDetails }) => (
  <Grid>
    {heroes.map(hero => (
      <div key={hero.username}>
        <HeroCard hero={hero} showDetails={showDetails} />
      </div>
    ))}
  </Grid>
)

export default HallOfFameMemberList
