// @ts-nocheck TODO fix this file!
import React from 'react'
import { GoChevronDown } from 'react-icons/go'

import { Button } from './button'

import { Popover } from './popover'
import { Menu } from './menu'

type Props = {
  items: any[]
  alignment?: 'left' | 'right'
  position?: 'bottom' | 'top'
  children?: React.ReactNode | ((any) => React.ReactNode)
  disabled?: boolean
  value?: string
}
export class DropdownMenu extends React.Component<Props> {
  static defaultProps = {
    alignment: 'left',
    position: 'bottom',
    disabled: false,
    showChevronIcon: true,
    style: {}
  }

  render() {
    const { items, value, position, disabled, alignment, children } = this.props

    const content =
      typeof items === 'function'
        ? items
        : ({ close }) => <Menu value={value} items={items} onClick={close} />

    const trigger =
      typeof children === 'function'
        ? children
        : ({ open }) => (
            <DropdownToggleButton
              onClick={open}
              position={position}
              disabled={disabled}
            >
              {children}
            </DropdownToggleButton>
          )

    return (
      <Popover {...this.props} content={content} alignment={alignment}>
        {trigger}
      </Popover>
    )
  }
}

export const DropdownToggleButton = ({ onClick, children, ...props }) => {
  return (
    <Button {...props} onClick={onClick}>
      {children}
      <GoChevronDown
        size={16}
        style={{ marginLeft: children ? '0.5rem' : undefined }}
      />
    </Button>
  )
}
