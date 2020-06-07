import React from 'react'

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

// export const ChevronRightIcon = ({
//   size = 16,
//   color = 'currentColor',
//   style
// }) => {
//   return (
//     <svg
//       width={size}
//       height={size}
//       className="octicon"
//       viewBox="0 0 8 16"
//       version="1.1"
//       aria-hidden="true"
//       style={style}
//     >
//       <path
//         fill={color}
//         fillRule="evenodd"
//         d="M7.5 8l-5 5L1 11.5 4.75 8 1 4.5 2.5 3l5 5z"
//       />
//     </svg>
//   )
// }

export const ChevronDownIcon = ({
  size = 16,
  color = 'currentColor',
  style
}) => {
  return (
    <svg
      width={size}
      height={size}
      className="octicon"
      viewBox="0 0 10 16"
      version="1.1"
      aria-hidden="true"
      style={style}
    >
      <path
        fill={color}
        fillRule="evenodd"
        d="M5 11L0 6l1.5-1.5L5 8.25 8.5 4.5 10 6l-5 5z"
      />
    </svg>
  )
}

// export const ChevronLeftIcon = ({
//   size = 16,
//   color = 'currentColor',
//   style
// }) => {
//   return (
//     <svg
//       width={size}
//       height={size}
//       className="octicon"
//       viewBox="0 0 8 16"
//       version="1.1"
//       aria-hidden="true"
//       style={style}
//     >
//       <path
//         full={color}
//         fillRule="evenodd"
//         d="M5.5 3L7 4.5 3.25 8 7 11.5 5.5 13l-5-5 5-5z"
//       />
//     </svg>
//   )
// }

export const StarIcon = ({ size = 16, color = 'currentColor' }) => {
  return (
    <svg
      width={size}
      height={size}
      className="octicon octicon-star"
      viewBox="0 0 14 16"
      version="1.1"
      aria-hidden="true"
    >
      <path
        fill={color}
        fillRule="evenodd"
        d="M14 6l-4.9-.64L7 1 4.9 5.36 0 6l3.6 3.26L2.67 14 7 11.67 11.33 14l-.93-4.74L14 6z"
      />
    </svg>
  )
}

export const MarkGitHubIcon = ({
  size = 16,
  color = 'currentColor',
  style
}) => {
  return (
    <svg
      width={size}
      height={size}
      className="octicon octicon-star"
      viewBox="0 0 16 16"
      version="1.1"
      aria-hidden="true"
      style={style}
    >
      <path
        fill={color}
        fillRule="evenodd"
        d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"
      />
    </svg>
  )
}

export const BookmarkIcon = ({ size = 16, color = 'currentColor', style }) => {
  return (
    <svg
      width={size}
      height={size}
      className="octicon"
      viewBox="0 0 10 16"
      version="1.1"
      aria-hidden="true"
      style={style}
    >
      <path
        fill={color}
        fillRule="evenodd"
        d="M9 0H1C.27 0 0 .27 0 1v15l5-3.09L10 16V1c0-.73-.27-1-1-1zm-.78 4.25L6.36 5.61l.72 2.16c.06.22-.02.28-.2.17L5 6.6 3.12 7.94c-.19.11-.25.05-.2-.17l.72-2.16-1.86-1.36c-.17-.16-.14-.23.09-.23l2.3-.03.7-2.16h.25l.7 2.16 2.3.03c.23 0 .27.08.09.23h.01z"
      />
    </svg>
  )
}

export const HomeIcon = ({ size = 16, color = 'currentColor', style }) => {
  return (
    <svg
      width={size}
      height={size}
      className="octicon"
      viewBox="0 0 16 16"
      version="1.1"
      aria-hidden="true"
      style={style}
    >
      <path
        fillRule="evenodd"
        fill={color}
        d="M16 9l-3-3V2h-2v2L8 1 0 9h2l1 5c0 .55.45 1 1 1h8c.55 0 1-.45 1-1l1-5h2zm-4 5H9v-4H7v4H4L2.81 7.69 8 2.5l5.19 5.19L12 14z"
      />
    </svg>
  )
}

export const KebabVerticalIcon = ({
  size = 16,
  color = 'currentColor',
  style
}) => {
  return (
    <svg
      width={size}
      height={size}
      className="octicon"
      viewBox="0 0 3 16"
      version="1.1"
      aria-hidden="true"
      style={style}
    >
      <path
        fill={color}
        fillRule="evenodd"
        d="M0 2.5a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0zm0 5a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0zM1.5 14a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"
      />
    </svg>
  )
}
export const SignOutIcon = ({ size = 16, color = 'currentColor', style }) => {
  return (
    <svg
      width={size}
      height={size}
      className="octicon"
      viewBox="0 0 16 16"
      version="1.1"
      aria-hidden="true"
      style={style}
    >
      <path
        fill={color}
        fillRule="evenodd"
        d="M12 9V7H8V5h4V3l4 3-4 3zm-2 3H6V3L2 1h8v3h1V1c0-.55-.45-1-1-1H1C.45 0 0 .45 0 1v11.38c0 .39.22.73.55.91L6 16.01V13h4c.55 0 1-.45 1-1V8h-1v4z"
      />
    </svg>
  )
}

export const TagIcon = ({ size = 16, color = 'currentColor', style }) => {
  return (
    <svg
      width={size}
      height={size}
      className="octicon"
      viewBox="0 0 14 16"
      version="1.1"
      aria-hidden="true"
      style={style}
    >
      <path
        fill={color}
        fillRule="evenodd"
        d="M7.73 1.73C7.26 1.26 6.62 1 5.96 1H3.5C2.13 1 1 2.13 1 3.5v2.47c0 .66.27 1.3.73 1.77l6.06 6.06c.39.39 1.02.39 1.41 0l4.59-4.59a.996.996 0 0 0 0-1.41L7.73 1.73zM2.38 7.09c-.31-.3-.47-.7-.47-1.13V3.5c0-.88.72-1.59 1.59-1.59h2.47c.42 0 .83.16 1.13.47l6.14 6.13-4.73 4.73-6.13-6.15zM3.01 3h2v2H3V3h.01z"
      />
    </svg>
  )
}

export const ThreeBarsIcon = ({ size = 16, color = 'currentColor', style }) => {
  return (
    <svg
      width={size}
      height={size}
      className="octicon"
      viewBox="0 0 12 16"
      version="1.1"
      aria-hidden="true"
      style={style}
    >
      <path
        fill={color}
        fillRule="evenodd"
        d="M11.41 9H.59C0 9 0 8.59 0 8c0-.59 0-1 .59-1H11.4c.59 0 .59.41.59 1 0 .59 0 1-.59 1h.01zm0-4H.59C0 5 0 4.59 0 4c0-.59 0-1 .59-1H11.4c.59 0 .59.41.59 1 0 .59 0 1-.59 1h.01zM.59 11H11.4c.59 0 .59.41.59 1 0 .59 0 1-.59 1H.59C0 13 0 12.59 0 12c0-.59 0-1 .59-1z"
      />
    </svg>
  )
}
