import React from "react";
import { Box, BoxProps, Flex } from "@chakra-ui/react";
import numeral from "numeral";

const monthNames = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" ");

type Month = {
  year: number;
  month: number;
};
type ResultItem = Month & { value: number };
type BarGraphItem = Month & { value: number | undefined };

type Props = {
  results: ResultItem[];
  showPlusSymbol: boolean;
  numberOfMonths?: number;
};
export const MonthlyTrendsChart = ({
  results,
  numberOfMonths = 12,
  showPlusSymbol = true,
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

  return <BarGraph items={items} showPlusSymbol={showPlusSymbol} />;
};

const BarGraph = ({
  items,
  showPlusSymbol,
}: {
  items: BarGraphItem[];
  showPlusSymbol: boolean;
}) => {
  const values = items
    .map(({ value }) => value)
    .filter((value) => value !== undefined);
  const maxValue = Math.max(...(values as number[]));

  return (
    <Box w="100%" mt={6}>
      <Flex minHeight={150}>
        {items.map(({ year, month, value }) => (
          <Flex
            key={`${year}/${month}`}
            flex={1}
            flexDirection="column"
            justifyContent="flex-end"
            marginRight={1}
          >
            <Bar
              value={value}
              maxValue={maxValue}
              showPlusSymbol={showPlusSymbol}
            />
          </Flex>
        ))}
      </Flex>
      <Flex>
        {items.map(({ year, month }) => (
          <Box key={`${year}/${month}`} flex={1} textAlign="center" mt={1}>
            {`'`}
            {year.toString().slice(2)}
            <br />
            {monthNames[month - 1]}
          </Box>
        ))}
      </Flex>
    </Box>
  );
};

const Bar = ({
  value,
  maxValue,
  showPlusSymbol,
}: {
  value: number | undefined;
  maxValue: number;
  showPlusSymbol: boolean;
}) => {
  const height = maxValue
    ? `${Math.round(((value || 0) * 100) / maxValue)}%`
    : "0px";

  if (!value) {
    return (
      <Box
        position="relative"
        borderBottom="1px dashed var(--graphBackgroundColor)"
        h="1px"
      >
        <BarLabel color="gray.400">
          {value === undefined ? (
            <span className="text-secondary">N/A</span>
          ) : (
            0
          )}
        </BarLabel>
      </Box>
    );
  }
  return (
    <Box
      position="relative"
      h={height}
      bg="linear-gradient(
      180deg,
      var(--graphBackgroundColor1),
      var(--graphBackgroundColor2)
    )"
    >
      <BarLabel>
        {value === undefined ? (
          <span className="text-secondary">N/A</span>
        ) : (
          <span>{formatDelta(value, { decimals: 1, showPlusSymbol })}</span>
        )}
      </BarLabel>
    </Box>
  );
};

const BarLabel = (props: BoxProps) => {
  return (
    <Box
      textAlign="center"
      fontSize={13}
      position="absolute"
      top={-22}
      width="100%"
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

function formatDelta(value, { decimals = 0, showPlusSymbol = false }) {
  const numberFormat =
    decimals === 0 || value < 1000 ? "0" : `0.${"0".repeat(decimals)}`;
  const formattedNumber = numeral(value).format(`${numberFormat}a`);
  return showPlusSymbol && value > 0 ? `+${formattedNumber}` : formattedNumber;
}
