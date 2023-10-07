import { GoMegaphone } from "react-icons/go";

import {
  Box,
  ExternalLink,
  Flex,
  Icon,
  Stack,
  useColorModeValue,
} from "components/core";
import { APP_REPO_URL } from "config";

export const BetaVersionNews = () => {
  const issueURL = APP_REPO_URL + "/issues/176";
  return (
    <Box
      mb={6}
      p={4}
      borderWidth="1px"
      bg={useColorModeValue("orange.50", "yellow.900")}
      borderColor={useColorModeValue("yellow.300", "yellow.600")}
      borderRadius="md"
    >
      <Flex mb={3} fontSize="xl" alignItems="center">
        <Icon as={GoMegaphone} fontSize="24px" color="var(--iconColor)" />
        <Box ml={2}>Next.js version live!</Box>
      </Flex>
      <Stack>
        <Box>
          Check the new{" "}
          <ExternalLink
            url="https://bestofjs.org"
            color="var(--textPrimaryColor)"
            fontFamily="var(--buttonFontFamily)"
            textDecoration="underline"
            fontWeight="bold"
          >
            bestofjs.org
          </ExternalLink>{" "}
          built with Next.js.
        </Box>
        <Box>
          <ExternalLink
            url={issueURL}
            color="var(--textPrimaryColor)"
            textDecoration="underline"
          >
            Read more
          </ExternalLink>{" "}
          about and shape the future of Best of JS.
        </Box>
      </Stack>
    </Box>
  );
};
