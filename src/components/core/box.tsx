// import styled from '@emotion/styled'
// import {
//   space,
//   color,
//   fontSize,
//   width
//   // fontWeight,
//   // lineHeight
// } from 'styled-system'

// export const Box = styled('div')`
//   ${space}
//   ${width}
//   ${fontSize}
//   ${color}
// `

import styled from '@emotion/styled'
import {
  border,
  compose,
  space,
  layout,
  typography,
  color,
  flexbox,
  grid
} from 'styled-system'
import css, { get } from '@styled-system/css'
import shouldForwardProp from '@styled-system/should-forward-prop'

const sx = props => css(props.sx)(props.theme)
const base = props => css(props.__css)(props.theme)
const variant = ({ theme, variant, tx = 'variants' }) =>
  css(get(theme, tx + '.' + variant, get(theme, variant)))(theme)

export const Box = styled('div', {
  shouldForwardProp
})(
  {
    boxSizing: 'border-box',
    margin: 0,
    minWidth: 0
  },
  base,
  variant,
  sx,
  props => props.css,
  compose(space, layout, typography, color, flexbox, border, grid)
)

export const Flex = styled(Box)({
  display: 'flex'
})

export const Grid = styled(Box)({
  display: 'grid'
})
