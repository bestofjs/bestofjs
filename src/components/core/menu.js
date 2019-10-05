import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'

export class Menu extends React.Component {
  static propTypes = {
    items: PropTypes.array.isRequired,
    onClick: PropTypes.func
  }

  render() {
    const { items, onClick: menuOnClick } = this.props

    return (
      <MenuRoot>
        {items
          .filter(item => !!item)
          .map(
            (
              { type = 'menu-item', label, icon, onClick, url, ...other },
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
                <MenuItemAction key={index} onClick={handleClick} {...other}>
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

export const MenuItemStyles = css`
  padding: 8px 12px;
  display: flex;
  align-items: center;
  color: inherit;
  font-family: sans-serif;
  ${props =>
    props.disabled
      ? css`
          opacity: 0.5;
        `
      : css`
          cursor: pointer;
          &:hover {
            background-color: #f6fad7;
          }
        `}
`

const MenuItemLink = styled.a`
  ${MenuItemStyles}
`

const MenuItemAction = styled.div`
  ${MenuItemStyles}
`

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

export class MenuDivider extends React.Component {
  render() {
    return (
      <div
        style={{
          marginTop: '0.5rem',
          marginBottom: '0.5rem',
          borderBottom: '1px solid #cccccc'
          // borderBottomWidth: s.border.borderWidth,
          // borderBottomColor: s.border.borderColor,
          // borderBottomStyle: s.border.borderStyle
        }}
      />
    )
  }
}
