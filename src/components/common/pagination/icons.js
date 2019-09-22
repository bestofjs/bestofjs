import React from 'react'

export const ChevronLeft = () => {
  return (
    <SVGContainer>
      <polyline points="15 18 9 12 15 6" />
    </SVGContainer>
  )
}

export const ChevronRight = () => {
  return (
    <SVGContainer>
      <polyline points="9 18 15 12 9 6" />
    </SVGContainer>
  )
}

export const DoubleChevronLeft = () => {
  return (
    <SVGContainer>
      <polyline points="11 17 6 12 11 7" />
      <polyline points="18 17 13 12 18 7" />
    </SVGContainer>
  )
}

export const DoubleChevronRight = () => {
  return (
    <SVGContainer>
      <polyline points="13 17 18 12 13 7" />
      <polyline points="6 17 11 12 6 7" />
    </SVGContainer>
  )
}

const SVGContainer = ({ children }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  )
}
