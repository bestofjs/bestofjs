import React from 'react'
import { GoKebabVertical } from 'react-icons/go'
import { useHistory } from 'react-router-dom'

import { Popover, Menu, Button } from '../core'

export const NavigationDropdownMenu = () => {
  const history = useHistory()

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
            label: `Tags`,
            onClick: () => {
              history.push('/tags')
              close()
            }
          },
          {
            label: `Hall of Fame`,
            onClick: () => {
              history.push('/hall-of-fame')
              close()
            }
          },
          {
            label: `Timeline 2010 - 2020`,
            onClick: () => {
              history.push('/timeline')
              close()
            }
          },
          {
            label: `About Best of JS`,
            onClick: () => {
              history.push('/about')
              close()
            }
          }
        ]
        return <Menu items={items} />
      }}
      alignment="right"
    >
      {({ open }) => (
        <Button
          onClick={open}
          style={{ padding: '0.3rem', borderRadius: '99px' }}
        >
          <GoKebabVertical fontSize="24px" />
        </Button>
      )}
    </Popover>
  )
}
