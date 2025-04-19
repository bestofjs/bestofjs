import { Box } from "components/core";

export const SizeDetailsList = ({ children }) => {
  return (
    <Box mt={4} pl={4} borderLeft="1px dashed var(--boxBorderColor)">
      {children}
    </Box>
  );
};

SizeDetailsList.Item = ({ children }) => {
  return <Box mb={2}>{children}</Box>;
};

SizeDetailsList.Link = ({ children }) => {
  return <Box>{children}</Box>;
};

SizeDetailsList.Explanation = ({ children }) => {
  return <span className="text-secondary"> ({children})</span>;
};
