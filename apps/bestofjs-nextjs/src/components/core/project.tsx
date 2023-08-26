import React from "react";
import numeral from "numeral";
import slugify from "slugify";

import { StarIcon } from "./icons";

type Props = {
  value: number;
};

export const DownloadCount = ({ value }: Props) => {
  if (value === undefined) {
    return <div className="star-delta text-sm">N/A</div>;
  }

  return <span>{numeral(value).format("a")}</span>;
};

const getSign = (value: number) => {
  if (value === 0) return "";
  return value > 0 ? "+" : "-";
};

export const StarDelta = ({
  average,
  ...props
}: Props & { average?: boolean }) =>
  average ? <StarDeltaAverage {...props} /> : <StarDeltaNormal {...props} />;

const StarDeltaNormal = ({ value }: Props) => {
  const sign = getSign(value);
  return (
    <div className="inline-flex items-center">
      {value === 0 ? (
        "="
      ) : (
        <>
          <span className="mr-0.5">{sign}</span>
          <span>{formatBigNumber(Math.abs(value))}</span>
          <StarIcon />
        </>
      )}
    </div>
  );
};

export const StarDeltaAverage = ({ value }: Props) => {
  const integerPart = Math.abs(Math.trunc(value));
  const decimalPart = (Math.abs(value - integerPart) * 10)
    .toFixed()
    .slice(0, 1);
  const sign = getSign(value);

  if (value === undefined)
    return <div className="star-delta text-sm text-muted-foreground">N/A</div>;

  return (
    <div className="inline-flex items-center">
      <span>{sign}</span>
      <span>{integerPart}</span>
      <span>.{decimalPart}</span>
      <StarIcon />
      <span> /day</span>
    </div>
  );
};

export const StarTotal = ({ value }: Props) => {
  return (
    <div className="inline-flex items-center">
      <span>{formatBigNumber(value)}</span>
      <StarIcon />
    </div>
  );
};

// Display a (potentially) big number, either the total number of star or a yearly/monthly delta
// using the `k` prefix
export function formatBigNumber(value: number): string {
  const digits = value > 1000 && value < 10000 ? "0.0" : "0";
  return numeral(value).format(digits + " a");
}

export function getProjectId(project: BestOfJS.RawProject) {
  return slugify(project.name, { lower: true, remove: /[.'/]/g });
}

export const getDeltaByDay =
  (period: string) =>
  ({ trends }: { trends: BestOfJS.Project["trends"] }) => {
    const periods = {
      daily: 1,
      weekly: 7,
      monthly: 30,
      quarterly: 90,
      yearly: 365,
    };

    // @ts-ignore
    const delta = trends[period] as number;
    // @ts-ignore
    const numberOfDays = periods[period] as number;
    return average(delta, numberOfDays);
  };

function average(delta: number | undefined, numberOfDays: number) {
  if (delta === undefined) return undefined; // handle recently added projects, without `yearly`, `monthly` data available
  return round(delta / numberOfDays);
}

function round(number: number, decimals = 1) {
  const i = Math.pow(10, decimals);
  return Math.round(number * i) / i;
}
