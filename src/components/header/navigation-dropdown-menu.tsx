import React from 'react'
import { useHistory } from 'react-router-dom'
import { GoKebabVertical } from 'react-icons/go'
import styled from '@emotion/styled'

import { StaticContentContainer } from 'containers/static-content-container'
import { Button, Popover, Menu } from 'components/core'
import { ExternalLinkIcon } from 'components/core/icons'

export const NavigationDropdownMenu = () => {
  const history = useHistory()
  const { risingStarsURL, stateOfJSURL } = StaticContentContainer.useContainer()

  return (
    <Popover
      content={({ close }) => {
        const items = [
          {
            label: `All Projects`,
            onClick: () => {
              history.push('/projects')
              close()
            },
            className: 'mobile-only'
          },
          {
            label: `Tags`,
            onClick: () => {
              history.push('/tags')
              close()
            },
            className: 'mobile-only'
          },
          {
            label: `Monthly Rankings`,
            onClick: () => {
              history.push('/rankings/monthly')
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
            label: `Timeline 2010 ~ 2020`,
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
          },
          { type: 'divider' },
          {
            type: 'label',
            label: <>Related Projects</>
          },
          {
            label: (
              <>
                Rising Stars
                <ExternalLinkIcon />
              </>
            ),
            url: risingStarsURL
          },
          {
            label: (
              <>
                State of JS
                <ExternalLinkIcon />
              </>
            ),
            url: stateOfJSURL
          }
        ]
        return <Menu items={items} />
      }}
      alignment="right"
    >
      {({ open }) => (
        <RoundedButton onClick={open}>
          <GoKebabVertical fontSize="24px" />
        </RoundedButton>
      )}
    </Popover>
  )
}
const RoundedButton = styled(Button)`
  padding: 0.3rem;
  border-radius: 99px;
`
