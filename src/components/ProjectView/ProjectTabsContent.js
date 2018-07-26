import styled from 'styled-components'

const cardBorderColor = '#cbcbcb'

const ProjectTabsContent = styled.div`
  background-color: #fff;
  border: 1px solid ${cardBorderColor};
  .inner {
    padding: 1rem;
  }
  .delta-bar-container {
    margin: 0 -1rem;
  }
  a:hover {
    text-decoration: none;
  }
  .project-link,
  .project-review-item {
    border-top: 1px dashed ${cardBorderColor};
    padding: 1rem 0;
  }
  .project-link:last-child,
  .project-review-item:last-child {
    border-bottom: 1px dashed ${cardBorderColor};
  }
  .project-link .project-link-date,
  .project-review-item .project-link-date,
  .project-link project-review-date,
  .project-review-item project-review-date {
    font-size: 13px;
  }
  .project-link .project-link-title,
  .project-review-item .project-link-title {
    font-size: 1.2rem;
  }
  .inner.github,
  .inner.tags,
  .inner.npm-section {
    border-top: 1px dashed ${cardBorderColor};
  }
  .inner.github,
  .inner.npm-section {
    border-top: 1px dashed ${cardBorderColor};
  }
  .inner.github .link,
  .inner.npm-section .link {
    border-bottom: 1px dotted ${cardBorderColor};
  }
  .inner.github a,
  .inner.github a:hover,
  .inner.npm-section a:hover {
    color: #cc4700;
  }
  .toggler {
    color: inherit;
    cursor: pointer;
  }
  .toggler:hover {
    color: #cc4700;
  }
  .toggler .icon {
    margin-right: 0.25rem;
  }
  .dependencies {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .dependencies .inline-list > * {
    color: #999;
  }
  .dependencies .inline-list > *:not(:last-child) {
    margin-right: 0.5rem;
  }
  .dependencies .block-list {
    width: 100%;
    border-spacing: 0;
    margin-top: 0.5rem;
    border: 1px dashed #cbcbcb;
    list-style: none;
  }
  .dependencies .block-list thead td {
    background-color: #ececec;
  }
  .dependencies .block-list td {
    padding: 0.25rem 0.5rem;
  }
  @media (max-width: 500px) {
    .dependencies .block-list td:last-child {
      display: none;
    }
  }
  .dependencies .block-list tbody tr td {
    border-top: 1px dashed #cbcbcb;
  }
  .dependencies .block-list li {
    margin-bottom: 0.25rem;
  }
  .dependencies .block-list a {
    color: inherit;
  }
  .dependencies .block-list a:hover {
    color: #cc4700;
  }
  .inner.github {
    display: flex;
  }
  .inner.github > div:first-child {
    flex: 1;
  }
  @media (max-width: 600px) {
    .inner.github {
      flex-direction: column;
    }
    .inner.github > div:last-child {
      margin-top: 0.5rem;
    }
  }
`

export default ProjectTabsContent
