import styled from 'styled-components'

const PaginationList = styled.ul`
  align-items: center;
  display: flex;
  justify-content: center;
  text-align: center;
  flex-wrap: wrap;
  margin: 0;
  list-style: none;
  @media (max-width: 599px) {
    display: none;
  }
`

export default PaginationList
