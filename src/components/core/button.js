import styled, { css } from 'styled-components'

export const Button = styled.button`
  display: flex;
  align-items: center;
  background-color: #fff;
  border: 1px solid var(--boxBorderColor);
  color: var(--textPrimaryColor);
  justify-content: center;
  padding: 0.5em 1em;
  text-align: center;
  white-space: nowrap;
  border-radius: 4px;
  font-size: 1rem;
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
