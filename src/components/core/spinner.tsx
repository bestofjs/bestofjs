import React from 'react'
import { Center, Spinner as ChakraSpinner } from '@chakra-ui/react'

export const Spinner = (props: BoxProps) => (
  <Center h={200} {...props}>
    <ChakraSpinner size="xl" speed="0.8s" color="var(--iconColor)" />
  </Center>
)
