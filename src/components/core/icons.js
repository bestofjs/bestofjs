import React from 'react'
import { GoStar, GoTag } from 'react-icons/go'

export const StarIcon = props => <GoStar {...props} />

export const TagIcon = props => <GoTag {...props} />

export const DoubleChevronLeftIcon = props => {
  return (
    <SVGContainer {...props}>
      <polyline points="11 17 6 12 11 7" />
      <polyline points="18 17 13 12 18 7" />
    </SVGContainer>
  )
}

export const DoubleChevronRightIcon = props => {
  return (
    <SVGContainer {...props}>
      <polyline points="13 17 18 12 13 7" />
      <polyline points="6 17 11 12 6 7" />
    </SVGContainer>
  )
}

export const ChevronLeftIcon = props => {
  return (
    <SVGContainer {...props}>
      <polyline points="15 18 9 12 15 6" />
    </SVGContainer>
  )
}

export const ChevronRightIcon = props => {
  return (
    <SVGContainer {...props}>
      <polyline points="9 18 15 12 9 6" />
    </SVGContainer>
  )
}

const SVGContainer = ({ children, color = 'currentColor', size = 24 }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      stroke={color}
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  )
}
