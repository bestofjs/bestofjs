/*
The following code is adapted from KeystoneJS project
https://github.com/keystonejs/keystone/blob/bc84c8b5c9d8339b92a415831dbaa1417cf43385/admin/client/App/elemental/Pagination/index.js
TODO clean what is not really used and make it more "functional programming"
*/
import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import styled, { css } from 'styled-components'

import PaginationList from './PaginationList'

const PaginationContainer = styled.div`
  margin: 2rem 0 1rem;
  align-items: center;
  display: flex;
  justify-content: center;
  text-align: center;
  @media (min-width: 900px) and (max-width: 1000px) {
    .pagination-previous,
    .pagination-next {
      display: none;
    }
  }
`

const commonStyles = css`
  font-size: 18px;
  color: var(--bestofjsOrange);
  background-color: #fff;
  border: 1px solid var(--bestofjsOrange);
  padding: 0.25em 0.5em;
  justify-content: center;
  margin: 0.25rem;
  text-align: center;
`

const PaginationLink = styled(Link)`
  ${commonStyles}
`

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

const PageNumber = ({ children, selected, url, page }) => {
  const fullUrl = `${url}?page=${page}`

  return (
    <li>
      {selected ? (
        <CurrentPageNumber>{children}</CurrentPageNumber>
      ) : (
        <PaginationLink to={fullUrl}>{children}</PaginationLink>
      )}
    </li>
  )
}

const PreviousPageLink = ({ isFirstPage, currentPage, url }) => {
  return isFirstPage ? (
    <DisabledLink>
      <span className="octicon octicon-chevron-left" />
    </DisabledLink>
  ) : (
    <PaginationLink
      to={`${url}?page=${currentPage - 1}`}
      className="pagination-previous"
    >
      <span className="octicon octicon-chevron-left" />
    </PaginationLink>
  )
}

const NextPageLink = ({ isLastPage, currentPage, url }) => {
  return isLastPage ? (
    <DisabledLink>
      <span className="octicon octicon-chevron-right" />
    </DisabledLink>
  ) : (
    <PaginationLink
      to={`${url}?page=${currentPage + 1}`}
      className="pagination-previous"
    >
      <span className="octicon octicon-chevron-right" />
    </PaginationLink>
  )
}

class Pagination extends React.Component {
  renderPages() {
    if (this.props.total <= this.props.pageSize) return null

    let pages = []
    let { currentPage, pageSize, total, limit } = this.props
    let totalPages = Math.ceil(total / pageSize)
    let minPage = 1
    let maxPage = totalPages

    if (limit && limit < totalPages) {
      let rightLimit = Math.floor(limit / 2)
      let leftLimit = rightLimit + (limit % 2) - 1
      minPage = currentPage - leftLimit
      maxPage = currentPage + rightLimit

      if (minPage < 1) {
        maxPage = limit
        minPage = 1
      }
      if (maxPage > totalPages) {
        minPage = totalPages - limit + 1
        maxPage = totalPages
      }
    }

    if (minPage > 1) {
      pages.push(
        <PageNumber
          key="page_start"
          page={1}
          url={this.props.url}
          query={this.props.query}
        >
          ...
        </PageNumber>
      )
    }

    for (let page = minPage; page <= maxPage; page++) {
      let selected = page === currentPage
      pages.push(
        <PageNumber
          key={'page_' + page}
          selected={selected}
          onSelect={this.onPageSelect}
          page={page}
          url={this.props.url}
          query={this.props.query}
        >
          {page}
        </PageNumber>
      )
    }

    if (maxPage < totalPages) {
      pages.push(
        <PageNumber
          key="page_end"
          onSelect={this.onPageSelect}
          page={totalPages}
          url={this.props.url}
        >
          ...
        </PageNumber>
      )
    }

    return pages
  }
  render() {
    const { url, total, pageSize, currentPage, style } = this.props
    const totalPages = Math.ceil(total / pageSize)
    const isFirstPage = currentPage === 1
    const isLastPage = currentPage === totalPages

    return (
      <PaginationContainer style={style}>
        <PaginationList style={{ marginTop: 0 }}>
          <PreviousPageLink
            url={url}
            isFirstPage={isFirstPage}
            currentPage={currentPage}
          />
          {this.renderPages()}
          <NextPageLink
            url={url}
            isLastPage={isLastPage}
            currentPage={currentPage}
          />
        </PaginationList>
      </PaginationContainer>
    )
  }
}

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  limit: PropTypes.number,
  pageSize: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired
}
Pagination.defaultProps = {
  limit: 5,
  pageSize: 20
}

export default Pagination
