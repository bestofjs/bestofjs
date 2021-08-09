import React from 'react'
import styled from '@emotion/styled'
import { css } from '@emotion/react'

type Props = {
  items: any[]
  value?: string
  onClick?: (event: React.MouseEventHandler) => void
}
export class Menu extends React.Component<Props> {
  render() {
    const { items, value, onClick: menuOnClick } = this.props

    return (
      <MenuRoot>
        {items
          .filter(item => !!item)
          .map(
            (
              { type = 'menu-item', label, id, icon, onClick, url, ...other },
              index
            ) => {
              if (type === 'divider') {
                return <MenuDivider key={index} />
              }
              if (type === 'label') {
                return <MenuLabel key={index}>{label}</MenuLabel>
              }

              const handleClick = event => {
                if (menuOnClick) {
                  menuOnClick(event)
                }
                return onClick && onClick(event)
              }

              if (url) {
                return (
                  <MenuItemLink key={index} href={url}>
                    {icon && <MenuItemIcon>{icon}</MenuItemIcon>}
                    {label}
                  </MenuItemLink>
                )
              }

              return (
                <MenuItemAction
                  key={index}
                  onClick={handleClick}
                  {...other}
                  isActive={value && id === value}
                >
                  {icon && <MenuItemIcon>{icon}</MenuItemIcon>}
                  {label}
                </MenuItemAction>
              )
            }
          )}
      </MenuRoot>
    )
  }
}

// === Low level components ===

export const MenuRoot = styled.div``

export const MenuItemStyles = props => css`
  padding: 8px 12px;
  display: flex;
  align-items: center;
  color: inherit;
  font-family: var(--headingFontFamily);
`

const disabledStyles = props => css`
  opacity: 0.5;
`
const activeStyles = props => css`
  background-color: var(--bestofjsOrange);
  color: white;
`
const normalStyles = props => css`
  cursor: pointer;
  &:hover {
    background-color: #f6fad7;
  }
`

type MenuProps = {
  active?: boolean
  disabled?: boolean
}
const MenuItemLink = styled.a<MenuProps>`
  ${MenuItemStyles}
  ${props => props.disabled && disabledStyles}
  ${props => props.active && activeStyles}
  ${props => !props.disabled && !props.active && normalStyles}
`

const MenuItemAction = props => <MenuItemLink {...props} as="div" />

const MenuItemIcon = styled.div`
  width: 16px;
  margin-right: 0.5rem;
`

export const MenuLabel = styled.div`
  color: #7a7a7a;
  font-size: 0.75em;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 8px 12px;
`

const MenuDivider = () => {
  return (
    <div
      style={{
        marginTop: '0.5rem',
        marginBottom: '0.5rem',
        borderBottom: '1px solid #cccccc'
      }}
    />
  )
}
