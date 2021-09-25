import React from 'react'
import { MdWbSunny } from 'react-icons/md'
import { IoMdMoon } from 'react-icons/io'

import { IconButton, IconButtonProps, useColorMode } from 'components/core'

export const ColorModePicker = (props: Partial<IconButtonProps>) => {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <IconButton
      onClick={toggleColorMode}
      icon={
        colorMode === 'dark' ? (
          <MdWbSunny fontSize="24px" color="var(--textSecondaryColor)" />
        ) : (
          <IoMdMoon fontSize="24px" color="var(--textSecondaryColor)" />
        )
      }
      aria-label={colorMode === 'dark' ? 'Light mode' : 'Dark mode'}
      variant="ghost"
      {...props}
    />
  )
}
