import styled from 'styled-components'

const errorBgColor = '#fff6f6'
const errorBorderColor = '#e0b4b4'
const cardBorderColor = '#cbcbcb'

const Input = styled.input`
  width: 100%;
  margin: 0;
  outline: 0;
  line-height: 1.2142em;
  padding: 0.67861429em 1em;
  font-size: 1em;
  background-color: ${props => (props.isError ? errorBgColor : 'white')};
  border: 1px solid
    ${props => (props.isError ? errorBorderColor : cardBorderColor)};
  color: rgba(0, 0, 0, 0.87);
  border-radius: 0.28571429rem;
`

export default Input
