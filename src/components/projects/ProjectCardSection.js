// import React from 'react'
import styled from 'styled-components'

const cardBorderColor = '#cbcbcb'

const ProjectCardSection = styled.section`
  padding: 1em;
  :not(:first-child) {
    border-top: 1px dashed ${cardBorderColor};
  }
  &.description-card-section {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  &.npm-card-section {
    display: flex;
    padding: 0;
  }
  &.npm-card-section > :first-child {
    flex-grow: 1;
  }
  &.npm-card-section > * {
    display: flex;
    align-items: center;
  }
  &.npm-card-section .quality-link {
    justify-content: flex-end;
  }
  &.npm-card-section .icon {
    margin-right: 0.25em;
  }
  &.npm-card-section .version {
    color: $textSecondaryColor;
    margin-left: 0.25em;
  }
`

export default ProjectCardSection
