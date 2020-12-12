import styled from '@emotion/styled'

export const Row = styled.div`
  display: flex;
`

export const MainColumn = styled.div`
  flex: 1 1 0%;
`

export const RightSideBar = styled.aside`
  flex-basis: 330px;
  padding-left: 2rem;
  @media (max-width: 999px) {
    display: none;
  }
`
