import { Box, Flex, Heading, chakra } from "./layout";

export const Section = chakra.section;

type Props = {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
};
export const SectionHeading = ({ icon, title, subtitle }: Props) => {
  return (
    <Flex mb={4} alignItems="center">
      {icon && (
        <Box pr={2} color="var(--iconColor)">
          {icon}
        </Box>
      )}
      <Box flexGrow={1}>
        <Heading as="h2" fontSize="1.5rem">
          {title}
        </Heading>
        {subtitle && (
          <Box color="var(--textSecondaryColor)" textTransform="uppercase">
            {subtitle}
          </Box>
        )}
      </Box>
    </Flex>
  );
};
