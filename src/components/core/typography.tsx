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
    <a href={fullURL} target="_blank" rel="noopener noreferrer" {...rest}>
      {children}
    </a>
  )
}

const Heading = styled.h1`
  display: flex;
  align-items: center;
  margin: 0;
  font-size: 1.5rem;
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
    <Heading style={{ paddingBottom: '1rem' }}>
      {icon && <PageTitleIcon>{icon}</PageTitleIcon>}
      {content}
      {subTitle && <PageSubTitle>{subTitle}</PageSubTitle>}
    </Heading>
  )
}

const PageTitleIcon = styled.div`
  margin-right: 0.5rem;
  color: var(--iconColor);
  display: flex;
`

const PageSubTitle = styled.span`
  color: var(--textMutedColor);
  font-size: 0.9em;
  margin-left: 0.5rem;
`
