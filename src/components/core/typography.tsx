import React from 'react'
import styled from '@emotion/styled'

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

const Heading = styled.h2`
  display: flex;
  align-items: center;
  margin: 0;
`

export const PageTitle = ({
  icon,
  children,
  extra,
  style
}: {
  children: any
  icon?: any
  extra?: any
  style?: any
}) => {
  return (
    <Heading style={{ paddingBottom: '1rem', ...style }}>
      {icon && <PageTitleIcon>{icon}</PageTitleIcon>}
      <div>
        {children}
        {extra && <PageTitleExtra>{extra}</PageTitleExtra>}
      </div>
    </Heading>
  )
}

const PageTitleIcon = styled.div`
  margin-right: 0.5rem;
  color: var(--iconColor);
  display: flex;
`

const PageTitleExtra = styled.span`
  color: var(--textSecondary);
  font-size: 16px;
  margin-left: 0.25rem;
`
