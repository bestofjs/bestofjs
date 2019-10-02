import React from 'react'
import PropTypes from 'prop-types'
import Octicon, { KebabVertical } from '@primer/octicons-react'

import { Button } from './button'
// import { ChevronDownIcon, ChevronUpIcon } from './icons'

import { Popover } from './popover'
import { Menu } from './menu'

export class DropdownMenu extends React.Component {
  static propTypes = {
    items: PropTypes.oneOfType([PropTypes.array, PropTypes.func]).isRequired,
    alignment: PropTypes.oneOf(['left', 'right']),
    disabled: PropTypes.bool,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    position: PropTypes.oneOf(['bottom', 'top']),
    style: PropTypes.object,
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.func])
  }

  static defaultProps = {
    alignment: 'left',
    position: 'bottom',
    disabled: false,
    showChevronIcon: true,
    style: {}
  }

  render() {
    const { items, position, disabled, alignment, children } = this.props

    const content =
      typeof items === 'function'
        ? items
        : ({ close }) => <Menu items={items} onClick={close} />

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

export class DropdownToggleButton extends React.Component {
  static propTypes = {
    position: PropTypes.oneOf(['bottom', 'top']),
    style: PropTypes.object,
    children: PropTypes.node
  }

  render() {
    const { position, children, style, ...props } = this.props

    return (
      <Button {...props} style={{ color: '#788080', ...style }}>
        {children}
        <Octicon size={'medium'}>
          <KebabVertical />
        </Octicon>
      </Button>
    )
  }
}
