import React from 'react'
import PropTypes from 'prop-types'
import { Link, withRouter } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { parse, stringify } from 'qs'

import { generatePageNumbers } from './helpers'
import {
  DoubleChevronLeft,
  DoubleChevronRight,
  ChevronLeft,
  ChevronRight
} from './icons'

const PaginationControls = ({
  total,
  pageSize,
  currentPage,
  style,
  location
}) => {
  const {
    pageNumbers,
    hasPreviousPage,
    hasNextPage,
    lastPageNumber,
    isFirstPageIncluded,
    isLastPageIncluded
  } = generatePageNumbers({
    total,
    currentPageNumber: currentPage,
    limit: pageSize
  })

  if (pageNumbers.length < 2) return null

  return (
    <PaginationContainer style={style}>
      <PaginationList style={{ marginTop: 0 }}>
        {!isFirstPageIncluded && <FirstPageLink />}
        {hasPreviousPage && <PreviousPageLink currentPage={currentPage} />}
        {pageNumbers.map(number => {
          return (
            <PageNumber
              key={number}
              number={number}
              selected={number === currentPage}
            />
          )
        })}
        {hasNextPage && <NextPageLink currentPage={currentPage} />}
        {!isLastPageIncluded && <LastPageLink number={lastPageNumber} />}
      </PaginationList>
    </PaginationContainer>
  )
}
PaginationControls.propTypes = {
  currentPage: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  pageSize: PropTypes.number
}
PaginationControls.defaultProps = {
  pageSize: 10
}

export default withRouter(PaginationControls)

const PaginationContainer = styled.div`
  margin: 2rem 0 1rem;
  align-items: center;
  display: flex;
  justify-content: center;
  text-align: center;
`

const PaginationList = styled.ul`
  align-items: center;
  display: flex;
  justify-content: center;
  text-align: center;
  flex-wrap: wrap;
  margin: 0;
  list-style: none;
`

const commonStyles = css`
  font-size: 18px;
  color: var(--bestofjsOrange);
  background-color: #fff;
  border: 1px solid var(--bestofjsOrange);
  justify-content: center;
  margin: 0.25rem;
  text-align: center;
  display: flex;
  align-items: center;
  width: 3rem;
  height: 3rem;
`

const StyledLink = styled(Link)`
  ${commonStyles}
`

const PaginationLink = withRouter(({ pageNumber, children, location }) => {
  return (
    <StyledLink to={getLinkTarget({ pageNumber, location })}>
      {children}
    </StyledLink>
  )
})

function getLinkTarget({ location, pageNumber }) {
  const params = parse(location.search, { ignoreQueryPrefix: true })
  params.page = pageNumber
  const search = stringify(params, { encode: false })

  return {
    ...location,
    search
  }
}

const CurrentPageNumber = styled.span`
  ${commonStyles}
  background-color: var(--bestofjsOrange);
  color: #fff;
`

const DisabledLink = styled.span`
  ${commonStyles}
  background-color: transparent;
  border-color: #aaa;
  box-shadow: none;
  color: #999;
  opacity: 0.5;
`

const PageNumber = ({ number, selected }) => {
  return (
    <li>
      {selected ? (
        <CurrentPageNumber>{number}</CurrentPageNumber>
      ) : (
        <PaginationLink pageNumber={number}>{number}</PaginationLink>
      )}
    </li>
  )
}

const PreviousPageLink = ({ disabled, currentPage }) => {
  return disabled ? (
    <DisabledLink>
      <ChevronLeft />
    </DisabledLink>
  ) : (
    <PaginationLink pageNumber={currentPage - 1}>
      <ChevronLeft />
    </PaginationLink>
  )
}

const NextPageLink = ({ disabled, currentPage }) => {
  return disabled ? (
    <DisabledLink>
      <ChevronRight />
    </DisabledLink>
  ) : (
    <PaginationLink pageNumber={currentPage + 1}>
      <ChevronRight />
    </PaginationLink>
  )
}

const FirstPageLink = () => {
  return (
    <PaginationLink pageNumber={1}>
      <DoubleChevronLeft />
    </PaginationLink>
  )
}

const LastPageLink = ({ number }) => {
  return (
    <PaginationLink pageNumber={number}>
      <DoubleChevronRight />
    </PaginationLink>
  )
}
