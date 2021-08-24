import React from 'react'
import { IconButton, IconButtonProps, useColorMode } from '@chakra-ui/react'
import { MdWbSunny } from 'react-icons/md'
import { IoMdMoon } from 'react-icons/io'

export const ColorModePicker = (props: IconButtonProps) => {
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
