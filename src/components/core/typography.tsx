import React from 'react'
import { Heading, Link } from '@chakra-ui/react'
import styled from '@emotion/styled'

import { usePageTitle } from './html-head'

/*
Link to external websites, that open in a new browser tab
See https://mathiasbynens.github.io/rel-noopener
*/
export const ExternalLink = ({
  url,
  children,
  ...rest
}: {
  url: string
  className?: string
  style?: any
  children: React.ReactNode
}) => {
  const fullURL = url.startsWith('http') ? url : `http://` + url
  return (
    <Link href={fullURL} target="_blank" rel="noopener noreferrer" {...rest}>
      {children}
    </Link>
  )
}

export const MenuItemLink = props => (
  <Link
    {...props}
    sx={{
      color: 'inherit',
      ':hover': {
        'text-decoration': 'none'
      }
    }}
  />
)

type PageHeaderProps = {
  title: string
  icon?: React.Node
  subTitle?: React.Node
  children?: ReactNode
}
export const PageHeader = ({
  title,
  icon,
  subTitle,
  children
}: PageHeaderProps) => {
  const content = children || title
  usePageTitle(title)

  return (
    <Heading
      as="h1"
      fontSize="2rem"
      fontWeight="normal"
      mb={4}
      display="flex"
      alignItems="center"
    >
      {icon && <PageTitleIcon>{icon}</PageTitleIcon>}
      {content}
      {subTitle && (
        <>
          <Separator>•</Separator>
          <PageSubTitle>{subTitle}</PageSubTitle>
        </>
      )}
    </Heading>
  )
}

const PageTitleIcon = styled.div`
  margin-right: 0.5rem;
  color: var(--iconColor);
  display: flex;
`

const Separator = styled.span`
  margin-left: 0.5rem;
  color: var(--iconColor);
`

const PageSubTitle = styled.span`
  color: var(--textSecondaryColor);
  margin-left: 0.5rem;
`
