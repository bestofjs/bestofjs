import { useState } from "react";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  type BoxProps,
  Grid,
  GridItem,
} from "components/core";
import numeral from "numeral";

const monthNames = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" ");

type Month = {
  year: number;
  month: number;
};
type ResultItem = Month & { value: number };
export type BarGraphItem = Month & { value: number | undefined };

type YearData = { year: number; months: number[] };

type FormattingOptions = { unit: string; showPlusSymbol?: boolean };

type Props = {
  results: ResultItem[];
  numberOfMonths?: number;
} & FormattingOptions;
export const MonthlyTrendsChart = ({
  results,
  numberOfMonths = 12,
  ...rest
}: Props) => {
  if (results.length === 0)
    return (
      <Box fontStyle="italic" pt={2}>
        No data available
      </Box>
    );

  const lastNMonths = getLastNMonths(numberOfMonths);

  const items = lastNMonths.map(({ year, month }) => {
    const foundResult = results.find(
      (result) => result.year === year && result.month === month,
    );
    const value = foundResult ? foundResult.value : undefined;
    return { year, month, value };
  });

  return <BarGraph items={items} {...rest} />;
};

type BarGraphProps = {
  items: BarGraphItem[];
} & FormattingOptions;
const BarGraph = ({ items, ...rest }: BarGraphProps) => {
  const values = items
    .map(({ value }) => value)
    .filter((value) => value !== undefined);
  const maxValue = Math.max(...(values as number[]));

  const [selectedItem, setSelectedItem] = useState<BarGraphItem | undefined>(
    undefined,
  );

  return (
    <Box w="100%">
      <ViewDetailsOnSmallScreens selectedItem={selectedItem} {...rest} />
      <Grid templateColumns="repeat(12, 1fr)">
        {items.map((item) => {
          const { year, month, value } = item;
          const maxHeight = 120;
          const height = Math.round(((value || 0) / maxValue) * maxHeight);

          return (
            <GridItem
              key={`${year}/${month}`}
              display="flex"
              flex={1}
              flexDirection="column"
              alignItems="center"
              justifyContent="flex-end"
            >
              <GraphBar
                height={height}
                value={value}
                year={year}
                month={month}
                onClick={() => setSelectedItem(item)}
                {...rest}
              />
            </GridItem>
          );
        })}
      </Grid>
      <MonthLabelGroup items={items} />
      <YearLabelGroup items={items} />
    </Box>
  );
};

// On small screens, we don't show numbers at the top of the graph bars
// Instead we show an area that displays the details when clicking on the bar.
const ViewDetailsOnSmallScreens = ({
  selectedItem,
  ...rest
}: {
  selectedItem: BarGraphItem | undefined;
} & FormattingOptions) => {
  return (
    <Alert
      display={{ base: "flex", md: "none" }}
      mb={2}
      status="info"
      fontSize="sm"
      fontFamily="var(--buttonFontFamily)"
      colorScheme="orange"
      p={2}
    >
      <AlertIcon />
      <AlertDescription>
        {selectedItem ? (
          <MonthSummary item={selectedItem} {...rest} />
        ) : (
          <Box>Click on the bars to view the numbers</Box>
        )}
      </AlertDescription>
    </Alert>
  );
};

const MonthSummary = ({
  item,
  unit,
  showPlusSymbol,
}: {
  item: BarGraphItem;
} & FormattingOptions) => {
  const { year, month, value } = item;
  const formattedValue =
    value === undefined
      ? "N/A"
      : formatValue(value, { decimals: 1, showPlusSymbol });
  return (
    <Box>
      {year} {monthNames[month - 1]}: {formattedValue} {unit}
    </Box>
  );
};

const GraphBar = ({
  height,
  value,
  year,
  month,
  unit,
  showPlusSymbol,
  onClick,
}: {
  height: number;
  value: number | undefined;
  year: number;
  month: number;
  onClick?: () => void;
} & FormattingOptions) => {
  if (!value) {
    return <EmptyGraphBar value={value} />;
  }

  const formattedValue = formatValue(value, { decimals: 1, showPlusSymbol });
  const formattedDate = year + "/" + month;
  const tooltipLabel = formattedDate + ": " + formattedValue + " " + unit;

  return (
    <>
      <BarTopLabel>{formattedValue}</BarTopLabel>
      <Box
        style={{ height }}
        w="75%"
        maxWidth={8}
        mt={1}
        aria-label={tooltipLabel}
        bg="linear-gradient(180deg,var(--graphBackgroundColor1),var(--graphBackgroundColor2))"
        onClick={onClick}
      ></Box>
    </>
  );
};

const EmptyGraphBar = ({ value }: { value: number | undefined }) => {
  return (
    <>
      <BarTopLabel color="gray.400">
        {value === undefined ? <span className="text-secondary">N/A</span> : 0}
      </BarTopLabel>
      <Box
        borderBottom="1px dashed var(--graphBackgroundColor1)"
        h="1px"
        w="75%"
        maxWidth={8}
        mt={1}
      />
    </>
  );
};

const BarTopLabel = (props: BoxProps) => {
  return (
    <Box
      display={{ base: "none", md: "block" }}
      textAlign="center"
      fontSize={14}
      width="100%"
      fontFamily="var(--buttonFontFamily)"
      {...props}
    />
  );
};

const MonthLabelGroup = ({ items }: { items: BarGraphItem[] }) => {
  return (
    <Grid
      templateColumns="repeat(12, 1fr)"
      gap={"1px"}
      mt={1}
      borderLeftWidth="1px"
      borderRightWidth="1px"
      borderColor="var(--graphBackgroundColor1)"
      bg="var(--graphBackgroundColor1)"
    >
      {items.map(({ year, month }) => {
        const monthName = monthNames[month - 1];
        const shortMonthName = month; // Show the month number (from 1 to 12) on small screens

        return (
          <GridItem
            key={`${year}/${month}`}
            textAlign="center"
            borderColor="var(--graphBackgroundColor1)"
            py={1}
            sx={{
              ":not([hidden]) ~ :not([hidden])": {
                borderLeftWidth: "0px",
              },
              backgroundColor: "var(--cardBackgroundColor)",
            }}
            bg="var(--cardBackgroundColor)"
            fontFamily="var(--buttonFontFamily)"
            textTransform="uppercase"
            fontSize="14px"
          >
            <Box display={{ base: "none", md: "block" }}>{monthName}</Box>
            <Box display={{ base: "block", md: "none" }} fontSize="md">
              {shortMonthName}
            </Box>
          </GridItem>
        );
      })}
    </Grid>
  );
};

const YearLabelGroup = ({ items }: { items: BarGraphItem[] }) => {
  const yearDataItems = getYearData(items);

  return (
    <Grid
      templateColumns="repeat(12, 1fr)"
      gap={"1px"}
      bg="var(--graphBackgroundColor1)"
      borderLeftWidth="1px"
      borderRightWidth="1px"
      borderColor="var(--graphBackgroundColor1)"
    >
      {yearDataItems.map((item) => {
        const colSpan = item.months.length;
        return (
          <GridItem
            key={item.year}
            colSpan={colSpan}
            bg="var(--cardBackgroundColor)"
          >
            <YearLabel>{item.year}</YearLabel>
          </GridItem>
        );
      })}
    </Grid>
  );
};

const YearLabel = (props: BoxProps) => {
  return (
    <Box
      textAlign="center"
      borderLeftWidth="0px"
      borderRightWidth="0px"
      borderBottomWidth="1px"
      borderColor="var(--graphBackgroundColor1)"
      fontFamily="var(--buttonFontFamily)"
      fontSize="14px"
      py={1}
      {...props}
    />
  );
};

function getLastNMonths(numberOfMonths: number) {
  const date = getFirstDayOfPreviousMonth();
  const months: Month[] = [];
  for (let i = 0; i < numberOfMonths; i++) {
    months.push({ year: date.getFullYear(), month: date.getMonth() + 1 });
    date.setMonth(date.getMonth() - 1);
  }
  months.reverse();
  return months;
}

function getFirstDayOfPreviousMonth() {
  const today = new Date();
  // first we need to jump to the last day of the previous month (Dec 31th if we are in January)
  const date = new Date(today.getFullYear(), today.getMonth(), 0, 0, 0, 0);
  date.setDate(1);
  return date;
}

function formatValue(value, { decimals = 0, showPlusSymbol = false }) {
  const numberFormat =
    decimals === 0 || value < 1000 ? "0" : `0.${"0".repeat(decimals)}`;
  const formattedNumber = numeral(value).format(`${numberFormat}a`);
  return showPlusSymbol && value > 0 ? `+${formattedNumber}` : formattedNumber;
}

// Generate data used to display the year indicator at the bottom of the chart
export function getYearData(barItems: BarGraphItem[]): YearData[] {
  const result: YearData[] = [];
  barItems.forEach((barItem) => {
    const { year, month } = barItem;
    const foundYearItem = result.find((item) => item.year === year);
    if (foundYearItem) {
      foundYearItem.months.push(month);
    } else {
      result.push({ year, months: [month] });
    }
  });
  return result;
}
