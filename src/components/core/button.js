import styled, { css } from 'styled-components'

export const Button = styled.button`
  display: flex;
  align-items: center;
  background-color: white;
  color: var(--textSecondaryColor);
  border: 1px solid var(--boxBorderColor);
  justify-content: center;
  padding: 0.5em 1em;
  text-align: center;
  white-space: nowrap;
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;
  &:not(:disabled):hover {
    cursor: pointer;
    color: var(--textPrimaryColor);
    border-color: var(--textMutedColor);
  }
  &:active,
  &:focus {
    outline: 0;
  }
  ${props => props.primary && PrimaryButtonMixin}
  ${props => props.disabled && DisabledButtonMixin}
`

const PrimaryButtonMixin = css`
  background-color: var(--bestofjsOrange);
  color: white;
  border-color: var(--boxBorderColor);
  &:hover {
    background-color: var(--bestofjsPurple);
  }
`

const DisabledButtonMixin = css`
  cursor: not-allowed;
  background-color: transparent;
  > * {
    opacity: 0.5;
  }
`

// ${props =>
//   props.disabled
//     ? css`
//         background-color: transparent;
//         > * {
//           opacity: 0.5;
//         }
//       `
//     : css`
//         cursor: pointer;
//         &:hover {
//           border-color: #b5b5b5;
//           color: ${props.primary ? 'white' : '#363636'};
//           background-color: ${
//             props.primary ? 'var(--bestofjsPurple)' : 'inherit'
//           };
//       `}
