/** biome-ignore-all lint/a11y/noStaticElementInteractions: TODO */
/** biome-ignore-all lint/a11y/useKeyWithClickEvents: TODO */
/** biome-ignore-all lint/a11y/useAriaPropsSupportedByRole: TODO */
"use client";

import { useState } from "react";
import { InfoIcon } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { formatNumber } from "@/lib/format-helpers";

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
    return <div className="pt-2 italic">No data available</div>;

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
    <div className="w-full">
      <ViewDetailsOnSmallScreens selectedItem={selectedItem} {...rest} />
      <div className="grid grid-cols-12">
        {items.map((item) => {
          const { year, month, value } = item;
          const maxHeight = 120;
          const height = Math.round(((value || 0) / maxValue) * maxHeight);

          return (
            <div
              key={`${year}/${month}`}
              className="flex flex-1 flex-col items-center justify-end"
            >
              <GraphBar
                height={height}
                value={value}
                year={year}
                month={month}
                onClick={() => setSelectedItem(item)}
                {...rest}
              />
            </div>
          );
        })}
      </div>
      <MonthLabelGroup items={items} />
      <YearLabelGroup items={items} />
    </div>
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
    <Alert className="mb-2 flex bg-transparent text-muted-foreground text-sm md:hidden">
      <InfoIcon className="size-4" />
      <AlertDescription>
        {selectedItem ? (
          <MonthSummary item={selectedItem} {...rest} />
        ) : (
          <div>Click on the bars to view the numbers</div>
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
    value === undefined ? "N/A" : formatValue(value, { showPlusSymbol });
  return (
    <div>
      {year} {monthNames[month - 1]}: {formattedValue} {unit}
    </div>
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

  const formattedValue = formatValue(value, { showPlusSymbol });
  const formattedDate = year + "/" + month;
  const tooltipLabel = formattedDate + ": " + formattedValue + " " + unit;

  return (
    <>
      <BarTopLabel>{formattedValue}</BarTopLabel>
      <div
        className="mt-1 w-3/4 max-w-8 bg-gradient-to-b from-[var(--graphBackgroundColor1)] to-[var(--graphBackgroundColor2)]"
        style={{ height }}
        aria-label={tooltipLabel}
        onClick={onClick}
      ></div>
    </>
  );
};

const EmptyGraphBar = ({ value }: { value: number | undefined }) => {
  return (
    <>
      <BarTopLabel className="text-muted-foreground">
        {value === undefined ? "N/A" : 0}
      </BarTopLabel>
      <div className="mt-1 h-px w-3/4 max-w-8 border-[var(--graphBackgroundColor1)] border-b-1 border-dashed" />
    </>
  );
};

const BarTopLabel = (props: React.HTMLProps<HTMLDivElement>) => {
  return (
    <div className="hidden w-full text-center text-sm md:block" {...props} />
  );
};

const MonthLabelGroup = ({ items }: { items: BarGraphItem[] }) => {
  return (
    <div className="mt-1 grid grid-cols-12 divide-x divide-solid border-[var(--graphBackgroundColor1)] border-x">
      {items.map(({ year, month }) => {
        const monthName = monthNames[month - 1];
        const shortMonthName = month; // Show the month number (from 1 to 12) on small screens

        return (
          <div
            key={`${year}/${month}`}
            className="border-[var(--graphBackgroundColor1)] py-1 text-center text-sm uppercase"
          >
            <div className="hidden md:block">{monthName}</div>
            <div className="text-sm md:hidden">{shortMonthName}</div>
          </div>
        );
      })}
    </div>
  );
};

const YearLabelGroup = ({ items }: { items: BarGraphItem[] }) => {
  const yearDataItems = getYearData(items);

  return (
    <div className="grid grid-cols-12 divide-x divide-solid border-[var(--graphBackgroundColor1)] border-x">
      {yearDataItems.map((item) => {
        const colSpan = item.months.length;
        return (
          <div
            key={item.year}
            style={{ gridColumn: `span ${colSpan} / span ${colSpan}` }}
            className="border-[var(--graphBackgroundColor1)] border-b py-1 text-center text-sm"
          >
            {item.year}
          </div>
        );
      })}
    </div>
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

function formatValue(value: number, { showPlusSymbol = false }) {
  const formattedNumber = formatNumber(value, "compact");
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
