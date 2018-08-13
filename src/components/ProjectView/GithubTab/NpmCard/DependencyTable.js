import styled from 'styled-components'

const DependencyTable = styled.table`
  width: 100%;
  border-spacing: 0;
  margin-top: 0.5rem;
  border: 1px dashed #cbcbcb;
  tbody td {
    padding: 0.25rem 0.5rem;
    border-top: 1px dashed #cbcbcb;
    &:first-child {
      width: 200px;
    }
  }
  thead td {
    padding: 0.25rem 0.5rem;
    background-color: #ececec;
    font-style: normal;
    text-align: left;
  }
  s thead td {
    background-color: #ececec;
  }
  td {
    padding: 0.25rem 0.5rem;
  }
  @media (max-width: 500px) {
    td:last-child {
      display: none;
    }
  }
  a {
    color: inherit;
  }
  a:hover {
    color: #cc4700;
  }
`

export default DependencyTable
