import styled from 'styled-components'

const Div = styled.div`
  margin-bottom: 0.5em;
  .icon {
    font-size: 1.5em;
    margin-right: 0.2em;
  }
  .on {
    color: #9e0142;
  }
  .off {
    color: #ddd;
  }
  &.editable .icon {
    font-size: 2.5em;
    cursor: pointer;
  }
`

export default Div
