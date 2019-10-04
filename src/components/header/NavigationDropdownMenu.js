import React from 'react'
import { withRouter } from 'react-router-dom'

import { Button, Popover, Menu } from '../core'
import { ThreeBarsIcon } from '../core/icons'

const NavigationDropdownMenu = withRouter(({ history }) => {
  return (
    <Popover
      content={({ close }) => {
        const items = [
          {
            label: `All Projects`,
            onClick: () => {
              history.push('/projects')
              close()
            }
          },
          {
            label: `JavaScript Hall of Fame`,
            onClick: () => {
              history.push('/hall-of-fame')
              close()
            }
          },
          {
            label: `About`,
            onClick: () => {
              history.push('/about')
              close()
            }
          }
        ]
        return <Menu items={items} close={close} />
      }}
      alignment="right"
      style={{ marginRight: '1rem' }}
    >
      {({ open }) => (
        <Button onClick={open}>
          <ThreeBarsIcon size={32} />
        </Button>
      )}
    </Popover>
  )
})

export default NavigationDropdownMenu
