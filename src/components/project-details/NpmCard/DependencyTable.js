import styled from 'styled-components'

const cellPadding = '1rem 1rem'

const DependencyTable = styled.table`
  width: 100%;
  border-spacing: 0;
  margin-top: 1rem;
  border: 1px dashed var(--boxBorderColor);
  tbody td {
    padding: ${cellPadding};
    border-top: 1px dashed var(--boxBorderColor);
    &:first-child {
      width: 200px;
    }
    vertical-align: top;
  }
  thead td {
    padding: ${cellPadding};
    background-color: #ececec;
    font-style: normal;
    text-align: left;
  }
  td {
    padding: ${cellPadding};
  }
  @media (max-width: 500px) {
    td:last-child {
      display: none;
    }
  }
`

// a {
//   color: inherit;
// }
// a:hover {
//   color: #cc4700;
// }

export default DependencyTable
