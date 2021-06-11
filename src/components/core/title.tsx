import React from 'react'
import { Helmet } from 'react-helmet'

import { PageTitle } from './typography'
import { defaultHelmetProps } from 'constants/constants'

export const Title = ({
  children,
  ...props
}: {
  children: any
  icon?: any
  extra?: any
  style?: any
}) => {
  return (
    <>
      <Helmet {...defaultHelmetProps}>
        <title>{children}</title>
      </Helmet>
      <PageTitle {...props}>{children}</PageTitle>
    </>
  )
}
