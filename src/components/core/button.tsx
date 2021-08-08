import styled from '@emotion/styled'
import { css } from '@emotion/react'

type ButtonProps = {
  primary?: boolean
  disabled?: boolean
}

export const Button = styled.button<ButtonProps>`
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
  font-family: var(--buttonFontFamily);
  &:hover {
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

export const ButtonLink = Button.withComponent('a')

const PrimaryButtonMixin = css`
  background-color: var(--bestofjsOrange);
  color: white;
  border-color: var(--boxBorderColor);
  &:hover {
    background-color: var(--bestofjsPurple);
    color: white;
  }
`

const DisabledButtonMixin = css`
  cursor: not-allowed;
  background-color: transparent;
  color: var(--textMutedColor);
  &:hover {
    color: var(--textMutedColor);
    border-color: var(--boxBorderColor);
  }
`
