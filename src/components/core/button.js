import styled, { css } from 'styled-components'

export const Button = styled.button`
  display: flex;
  align-items: center;
  background-color: #fff;
  border: 1px solid #dbdbdb;
  color: #363636;
  justify-content: center;
  padding: 0.5em 1em;
  text-align: center;
  white-space: nowrap;
  border-radius: 4px;
  font-size: 14px;
  font-family: inherit;
  ${props =>
    props.disabled
      ? css`
          background-color: transparent;
          > * {
            opacity: 0.5;
          }
        `
      : css`
          cursor: pointer;
          &:hover {
            border-color: #b5b5b5;
            color: #363636;
          }
        `}
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
