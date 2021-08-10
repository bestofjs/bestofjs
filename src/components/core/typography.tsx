import React from 'react'
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
    <StyledLink
      href={fullURL}
      target="_blank"
      rel="noopener noreferrer"
      {...rest}
    >
      {children}
    </StyledLink>
  )
}

const StyledLink = styled.a`
  font-family: var(--buttonFontFamily);
`

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
    <Heading>
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

const Heading = styled.h1`
  display: flex;
  align-items: center;
  margin: 0 0 1rem;
  font-size: 1.5rem;
`

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
