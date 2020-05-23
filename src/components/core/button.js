import styled, { css } from 'styled-components'

export const Button = styled.button`
  display: flex;
  align-items: center;
  background-color: ${props =>
    props.primary ? 'var(--bestofjsOrange)' : 'white'};
  color: ${props => (props.primary ? 'white' : 'var(--textPrimaryColor)')};
  border: 1px solid
    ${props =>
      props.primary ? 'var(--bestofjsOrange)' : 'var(--boxBorderColor)'};
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
            color: ${props.primary ? 'white' : '#363636'};
            background-color: ${
              props.primary ? 'var(--bestofjsPurple)' : 'inherit'
            };
        `}
  &:active,
  &:focus {
    outline: 0;
  }
`
