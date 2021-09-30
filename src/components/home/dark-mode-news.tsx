import React from 'react'
import { GoMegaphone } from 'react-icons/go'

import {
  Box,
  ExternalLink,
  Flex,
  Icon,
  useColorModeValue
} from 'components/core'
import { StaticContentContainer } from 'containers/static-content-container'

export const DarkModeNews = () => {
  const { repoURL } = StaticContentContainer.useContainer()
  return (
    <Box
      mb={6}
      p={4}
      borderWidth="1px"
      bg={useColorModeValue('orange.50', 'yellow.900')}
      borderColor={useColorModeValue('yellow.300', 'yellow.600')}
      bgX="var(--cardBackgroundColor)"
      borderRadius="md"
    >
      <Flex mb={3} fontSize="xl" alignItems="center">
        <Icon as={GoMegaphone} fontSize="24px" color="var(--iconColor)" />
        <Box ml={2}>Hello dark mode fans!</Box>
      </Flex>
      <Box>
        Dark mode is here!
        <br />
        Issues? Feedback? <br />
        Reach us on{' '}
        <ExternalLink url={repoURL} color="var(--textPrimaryColor)">
          GitHub
        </ExternalLink>
        , thank you!
      </Box>
    </Box>
  )
}
