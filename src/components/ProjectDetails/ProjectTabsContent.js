import styled from 'styled-components'

const cardBorderColor = '#cbcbcb'

/*
This part has to be refactored.
It has been created by moving from the CSS old approach to styled-components
but we don't need any more all there class names
*/
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
  .inner.github a,
  .inner.github a:hover,
  .inner.npm-section a:hover {
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
