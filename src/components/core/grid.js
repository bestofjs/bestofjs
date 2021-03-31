import styled from '@emotion/styled'

const gutter = '1rem'

export const Grid = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: -${gutter};
  margin-left: -${gutter};
`

export const Cell = styled.div`
  padding-top: ${gutter};
  padding-left: ${gutter};
`
