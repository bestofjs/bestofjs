import React from 'react'
import styled from '@emotion/styled'
import { Helmet } from 'react-helmet'

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
  return (
    <>
      <Helmet titleTemplate="%s | Best of JS">
        <title>{title}</title>
      </Helmet>
      <Heading style={{ paddingBottom: '1rem' }}>
        {icon && <PageTitleIcon>{icon}</PageTitleIcon>}
        {content}
        {subTitle && <PageSubTitle>{subTitle}</PageSubTitle>}
      </Heading>
    </>
  )
}

const PageTitleIcon = styled.div`
  margin-right: 0.5rem;
  color: var(--iconColor);
  display: flex;
`

const PageSubTitle = styled.span`
  color: var(--textSecondary);
  font-size: 16px;
  margin-left: 0.5rem;
`
