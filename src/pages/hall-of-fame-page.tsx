import React from 'react'

import { useHallOfFame } from 'containers/hall-of-fame-container'
import { MainContent, Spinner } from 'components/core'
import { MoreHeroes } from 'components/hall-of-fame/more-heroes'
import { HallOfFameMemberList } from 'components/hall-of-fame/hall-of-fame-member-list'
import { defaultHelmetProps } from 'constants/constants'
import { Helmet } from 'react-helmet'

const HallOfFamePage = () => {
  const { heroes, isPending } = useHallOfFame()

  if (isPending) return <Spinner />

  const title = 'JavaScript Hall of Fame'

  return (
    <MainContent>
      <Helmet {...defaultHelmetProps}>
        <title>{title}</title>
      </Helmet>
      <h1 style={{ marginBottom: '1rem' }}>{title}</h1>
      <div style={{ marginBottom: '2rem' }}>
        Here are some of the greatest developers, authors and speakers of the
        JavaScript community.
        <br />
        It is like the basket-ball Hall of Fame... except they are all still in
        activity!
      </div>
      <HallOfFameMemberList heroes={heroes} />
      <MoreHeroes />
    </MainContent>
  )
}

export default HallOfFamePage
