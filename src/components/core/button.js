import styled from 'styled-components'

export const Button = styled.button`
  display: flex;
  align-items: center;
  background-color: #fff;
  border: 1px solid #dbdbdb;
  color: #363636;
  cursor: pointer;
  justify-content: center;
  padding-bottom: calc(0.375em - 1px);
  padding-left: 0.75em;
  padding-right: 0.75em;
  padding-top: calc(0.375em - 1px);
  text-align: center;
  white-space: nowrap;
  border-radius: 4px;
  font-size: 14px;
  font-family: inherit;
  &:hover {
    border-color: #b5b5b5;
    color: #363636;
  }
  &:active,
  &:focus {
    outline: 0;
  }
`

// display: inline-block;
// color: inherit;
// background-color: white;
// border-radius: 6px;
// transition: all 0.3s;
// border: 1px solid #cccccc;
// font-size: 1rem;
// padding: 10px 16px;
// cursor: pointer;
