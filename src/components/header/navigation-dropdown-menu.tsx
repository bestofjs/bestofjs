import React from 'react'
import { useHistory } from 'react-router-dom'
import styled from '@emotion/styled'
import { FiMenu } from 'react-icons/fi'

import { StaticContentContainer } from 'containers/static-content-container'
import { Button, Popover, Menu } from 'components/core'
import { ExternalLinkIcon } from 'components/core/icons'
import { GoChevronDown } from 'react-icons/go'

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
        <ButtonContainer>
          <MenuButton onClick={open} className="desktop-only">
            More
            <GoChevronDown />
          </MenuButton>
          <RoundedButton onClick={open} className="mobile-only">
            <FiMenu fontSize="28px" />
          </RoundedButton>
        </ButtonContainer>
      )}
    </Popover>
  )
}
const ButtonContainer = styled.div`
  // padding-left: 0.25rem;
  // padding-right: 0.25rem;
`
const RoundedButton = styled(Button)`
  padding: 0.3rem;
  border-width: 0;
  color: var(--textMutedColor);
`

const MenuButton = styled(Button)`
  border-width: 0;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  font-size: 16px;
  svg {
    margin-left: 0.25rem;
  }
`
