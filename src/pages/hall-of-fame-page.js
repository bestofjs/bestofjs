import React from 'react'

import HallOfFame from '../components/hall-of-fame/HallOfFame'
import { useHallOfFame } from 'containers/hall-of-fame-container'
import { Spinner } from 'components/core'

const HallOfFamePage = () => {
  const { heroes, isPending } = useHallOfFame()

  if (isPending) return <Spinner />

  return <HallOfFame heroes={heroes} showDetails />
}

export default HallOfFamePage
