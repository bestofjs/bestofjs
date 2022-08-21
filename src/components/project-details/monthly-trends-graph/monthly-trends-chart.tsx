import numeral from "numeral";
import { Box, BoxProps, Flex, Grid, GridItem, Stack } from "components/core";

const monthNames = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" ");

type Month = {
  year: number;
  month: number;
};
type ResultItem = Month & { value: number };
export type BarGraphItem = Month & { value: number | undefined };

type YearData = { year: number; months: number[] };

type Props = {
  results: ResultItem[];
  numberOfMonths?: number;
  unit: string;
};
export const MonthlyTrendsChart = ({
  results,
  numberOfMonths = 12,
  unit,
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
      (result) => result.year === year && result.month === month
    );
    const value = foundResult ? foundResult.value : undefined;
    return { year, month, value };
  });

  return <BarGraph items={items} unit={unit} />;
};

type BarGraphProps = {
  items: BarGraphItem[];
  unit: string;
};
const BarGraph = ({ items, unit }: BarGraphProps) => {
  const values = items
    .map(({ value }) => value)
    .filter((value) => value !== undefined);
  const maxValue = Math.max(...(values as number[]));

  return (
    <Box w="100%">
      <Stack direction="row" minHeight={150} pt={{ md: 6 }} spacing={1}>
        {items.map(({ year, month, value }) => (
          <Flex
            key={`${year}/${month}`}
            flex={1}
            flexDirection="column"
            justifyContent="flex-end"
          >
            <GraphBar
              value={value}
              year={year}
              month={month}
              maxValue={maxValue}
              unit={unit}
            />
          </Flex>
        ))}
      </Stack>
      <MonthLabelGroup items={items} />
      <YearLabelGroup items={items} />
    </Box>
  );
};

const GraphBar = ({
  value,
  year,
  month,
  maxValue,
  unit,
}: {
  value: number | undefined;
  maxValue: number;
  year: number;
  month: number;
  unit: string;
}) => {
  if (!value) {
    return <EmptyGraphBar value={value} />;
  }

  const height = maxValue
    ? `${Math.round(((value || 0) * 100) / maxValue)}%`
    : "0px";

  const formattedValue = formatValue(value, { decimals: 1 });
  const formattedDate = year + "/" + month;
  const tooltipLabel = formattedDate + ": " + formattedValue + " " + unit;

  return (
    <Box
      position="relative"
      h={height}
      className="hint--top"
      aria-label={tooltipLabel}
      bg="linear-gradient(
      180deg,
      var(--graphBackgroundColor1),
      var(--graphBackgroundColor2)
    )"
    >
      <BarTopLabel>
        <span>{formattedValue}</span>
      </BarTopLabel>
    </Box>
  );
};

const EmptyGraphBar = ({ value }: { value: number | undefined }) => {
  return (
    <Box
      position="relative"
      borderBottom="1px dashed var(--graphBackgroundColor)"
      h="1px"
    >
      <BarTopLabel color="gray.400">
        {value === undefined ? <span className="text-secondary">N/A</span> : 0}
      </BarTopLabel>
    </Box>
  );
};

const BarTopLabel = (props: BoxProps) => {
  return (
    <Box
      display={{ base: "none", md: "block" }}
      textAlign="center"
      fontSize={13}
      position="absolute"
      top={-22}
      width="100%"
      {...props}
    />
  );
};

const MonthLabelGroup = ({ items }: { items: BarGraphItem[] }) => {
  return (
    <Grid templateColumns="repeat(12, 1fr)" gap={1} mt={1}>
      {items.map(({ year, month }) => {
        const monthName = monthNames[month - 1];
        const shortMonthName = month; // Show the month number (from 1 to 12) on small screens

        return (
          <GridItem
            key={`${year}/${month}`}
            textAlign="center"
            mt={0}
            borderLeftWidth="1px"
            borderRightWidth="1px"
            borderBottomWidth="1px"
            py={1}
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
    <Grid templateColumns="repeat(12, 1fr)" gap={1} mt={1}>
      {yearDataItems.map((item) => {
        const colSpan = item.months.length;
        return (
          <GridItem key={item.year} colSpan={colSpan}>
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
      borderLeftWidth="1px"
      borderRightWidth="1px"
      borderBottomWidth="1px"
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

function formatValue(value: number, { decimals = 0 }) {
  const numberFormat =
    decimals === 0 || value < 1000 ? "0" : `0.${"0".repeat(decimals)}`;
  return numeral(value).format(`${numberFormat}a`);
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
