/*
The following code is adapted from KeystoneJS project
https://github.com/keystonejs/keystone/blob/bc84c8b5c9d8339b92a415831dbaa1417cf43385/admin/client/App/elemental/Pagination/index.js
TODO clean what is not really used and make it more "functional programming"
*/
import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import PaginationList from './PaginationList'

const Div = styled.div`
  font-size: inherit;
  margin-bottom: 1rem;
  align-items: center;
  display: flex;
  justify-content: center;
  text-align: center;
  .pagination-previous,
  .pagination-next,
  .pagination-link,
  .pagination-ellipsis {
    color: #ffae63;
    background-color: #fff;
    border: 1px solid #ffae63;
    font-size: 1em;
    padding: 0.25em 0.5em;
    justify-content: center;
    margin: 0.25rem;
    text-align: center;
  }
  .pagination-previous,
  .pagination-next,
  .pagination-link {
    border-color: #ffae63;
    min-width: 2.25em;
  }
  .pagination-previous:hover,
  .pagination-next:hover,
  .pagination-link:hover {
    border-color: $bestofjsOrange;
    color: $bestofjsOrange;
  }
  .pagination-previous:focus,
  .pagination-next:focus,
  .pagination-link:focus {
    border-color: $link-focus-border;
  }
  .pagination-previous:active,
  .pagination-next:active,
  .pagination-link:active {
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.2);
  }
  .pagination-previous[disabled],
  .pagination-next[disabled],
  .pagination-link[disabled] {
    background-color: transparent;
    border-color: #aaa;
    box-shadow: none;
    color: #999;
    opacity: 0.5;
  }
  .pagination-previous,
  .pagination-next {
    padding-left: 0.75em;
    padding-right: 0.75em;
    white-space: nowrap;
  }
  @media (min-width: 900px) and (max-width: 1000px) {
    .pagination-previous,
    .pagination-next {
      display: none;
    }
  }
  @media (min-width: 600px) {
    .pagination-previous .text,
    .pagination-next .text {
      display: none;
    }
  }
  .pagination-link.is-current {
    background-color: #ffae63;
    border-color: #ffae63;
    color: #fff;
  }
  .pagination-ellipsis {
    color: $grey-light;
    pointer-events: none;
  }
`

class Page extends React.Component {
  onSelect() {
    this.props.onSelect(this.props.page)
  }
  render() {
    const { children, selected, url, page } = this.props
    const fullUrl = `${url}?page=${page}`
    const className = classNames('pagination-link', {
      'is-current': selected
    })
    return (
      <li>
        <Link className={className} to={fullUrl}>
          {children}
        </Link>
      </li>
    )
  }
}

const PreviousPageLink = ({ isFirstPage, currentPage, url }) => {
  return isFirstPage ? (
    <div disabled className="pagination-previous">
      <span className="octicon octicon-chevron-left" />
      <span className="text"> Previous</span>
    </div>
  ) : (
    <Link
      to={`${url}?page=${currentPage - 1}`}
      className="pagination-previous"
      data-balloon={`Show the previous page of projects (#${currentPage - 1})`}
    >
      <span className="octicon octicon-chevron-left" />
      <span className="text"> Previous</span>
    </Link>
  )
}

const NextPageLink = ({ isLastPage, currentPage, url }) => {
  return isLastPage ? (
    <div disabled className="pagination-previous">
      <span className="text">Next </span>
      <span className="octicon octicon-chevron-right" />
    </div>
  ) : (
    <Link
      to={`${url}?page=${currentPage + 1}`}
      className="pagination-previous"
      data-balloon={`Show the next page of projects (#${currentPage + 1})`}
    >
      <span className="text">Next </span>
      <span className="octicon octicon-chevron-right" />
    </Link>
  )
}

class Pagination extends React.Component {
  renderCount() {
    let count = ''
    let { currentPage, pageSize, plural, singular, total } = this.props
    if (total <= pageSize) return null
    if (!total) {
      count = 'No ' + (plural || 'records')
    } else if (total > pageSize) {
      let start = pageSize * (currentPage - 1) + 1
      let end = Math.min(start + pageSize - 1, total)
      count = `Showing ${start} to ${end} of ${total}`
    } else {
      count = 'Showing ' + total
      if (total > 1 && plural) {
        count += ' ' + plural
      } else if (total === 1 && singular) {
        count += ' ' + singular
      }
    }
    return <div className="Pagination__count">{count}</div>
  }
  onPageSelect(page) {
    if (this.props.onPageSelect) {
      this.props.onPageSelect(page)
    }
  }
  renderPages() {
    if (this.props.total <= this.props.pageSize) return null

    let pages = []
    let { currentPage, pageSize, total, limit } = this.props
    let totalPages = Math.ceil(total / pageSize)
    let minPage = 1
    let maxPage = totalPages

    if (limit && limit < totalPages) {
      let rightLimit = Math.floor(limit / 2)
      let leftLimit = rightLimit + limit % 2 - 1
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
        <Page
          key="page_start"
          onSelect={this.onPageSelect}
          page={1}
          url={this.props.url}
          query={this.props.query}
        >
          ...
        </Page>
      )
    }
    for (let page = minPage; page <= maxPage; page++) {
      let selected = page === currentPage
      /* eslint-disable no-loop-func */
      pages.push(
        <Page
          key={'page_' + page}
          selected={selected}
          onSelect={this.onPageSelect}
          page={page}
          url={this.props.url}
          query={this.props.query}
        >
          {page}
        </Page>
      )
      /* eslint-enable */
    }
    if (maxPage < totalPages) {
      pages.push(
        <Page
          key="page_end"
          onSelect={this.onPageSelect}
          page={totalPages}
          url={this.props.url}
        >
          ...
        </Page>
      )
    }
    return (
      // override bulma marginTop (small screens)
      <PaginationList style={{ marginTop: 0 }}>{pages}</PaginationList>
    )
  }
  render() {
    const className = classNames('pagination', this.props.className)
    const { url, total, pageSize, currentPage } = this.props
    const totalPages = Math.ceil(total / pageSize)
    const isFirstPage = currentPage === 1
    const isLastPage = currentPage === totalPages
    return (
      <Div>
        {false && this.renderCount()}
        <PreviousPageLink
          url={url}
          isFirstPage={isFirstPage}
          currentPage={currentPage}
        />
        <NextPageLink
          url={url}
          isLastPage={isLastPage}
          currentPage={currentPage}
        />
        {this.renderPages()}
      </Div>
    )
  }
}

Pagination.propTypes = {
  className: PropTypes.string,
  currentPage: PropTypes.number.isRequired,
  limit: PropTypes.number,
  onPageSelect: PropTypes.func,
  pageSize: PropTypes.number.isRequired,
  plural: PropTypes.string,
  singular: PropTypes.string,
  style: PropTypes.object,
  total: PropTypes.number.isRequired
}

export default Pagination
