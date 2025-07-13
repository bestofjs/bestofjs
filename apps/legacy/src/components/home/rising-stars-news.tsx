import {
  Box,
  ExternalLink,
  Flex,
  Icon,
  useColorModeValue,
} from "components/core";
import { RISING_STARS_URL } from "config";
import { GoMegaphone } from "react-icons/go";

export const RisingStarsNews = () => {
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
        <Box ml={2}>2021's Rising Stars</Box>
      </Flex>
      <Box>
        Our{" "}
        <ExternalLink
          url={RISING_STARS_URL}
          color="var(--textPrimaryColor)"
          textDecoration="underline"
          _hover={{ textDecoration: "none" }}
        >
          Rising Stars
        </ExternalLink>{" "}
        have been released, check the best of 2021!
      </Box>
    </Box>
  );
};
