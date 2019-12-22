import styled from 'styled-components'

const gutter = '1rem'

export const Grid = styled.div`
  margin-top: -${gutter};
  margin-left: -${gutter};
`

export const Cell = styled.div`
  display: inline-block;
  padding-top: ${gutter};
  padding-left: ${gutter};
`
