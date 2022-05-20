import { MonthlyTrendsChart } from "components/project-details/monthly-trends-chart";
import { useFetchMonthlyDownloads } from "../../../api/hooks";
import { Box, Spinner, useColorModeValue } from "../../core";

export const PackageMonthlyDownloadChart = ({ project, ...rest }) => {
  const color1 = useColorModeValue("colors.red.200", "colors.red.700");
  const color2 = useColorModeValue("colors.red.100", "colors.red.800");
  return (
    <Box
      sx={{
        "--graphBackgroundColor1": color1,
        "--graphBackgroundColor2": color2,
      }}
    >
      <p>Monthly downloads on NPM</p>
      <FetchDownloadCharts project={project} />
    </Box>
  );
};

const FetchDownloadCharts = ({ project }) => {
  const { packageName } = project;
  const { data, error } = useFetchMonthlyDownloads(packageName);

  if (error) {
    return (
      <div style={{ marginTop: "1rem" }}>
        Unable to fetch monthly downloads, please contact us to fix the issue!
      </div>
    );
  }

  if (!data) {
    return <Spinner />;
  }

  const results = data.map(({ year, month, downloads }) => ({
    year,
    month,
    value: downloads,
  }));

  return (
    <div>
      <MonthlyTrendsChart results={results} showPlusSymbol={false} />
    </div>
  );
};
