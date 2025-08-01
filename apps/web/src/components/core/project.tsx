import { formatNumber } from "@/helpers/numbers";

import { StarIcon } from "./icons";

type Props = {
  value: number;
};

export const DownloadCount = ({ value }: Props) => {
  if (value === undefined) {
    return <div className="star-delta text-sm">N/A</div>;
  }

  return <span>{formatNumber(value, "compact")}</span>;
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
          <span>{formatNumber(Math.abs(value), "compact")}</span>
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
    return <div className="star-delta text-muted-foreground text-sm">N/A</div>;

  return (
    <div className="flex flex-col items-center">
      <div>
        <span>{sign}</span>
        <span>{integerPart}</span>
        <span>.{decimalPart}</span>
      </div>
      <div className="inline-flex items-center">
        <StarIcon />
        <span> /day</span>
      </div>
    </div>
  );
};

export const StarTotal = ({ value }: Props) => {
  return (
    <div className="inline-flex items-center">
      <span>{formatNumber(value, "compact")}</span>
      <StarIcon />
    </div>
  );
};

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

    const delta = trends[period as keyof BestOfJS.Project["trends"]];
    const numberOfDays = periods[period as keyof BestOfJS.Project["trends"]];
    return average(delta, numberOfDays);
  };

function average(delta: number | undefined, numberOfDays: number) {
  if (delta === undefined) return undefined; // handle recently added projects, without `yearly`, `monthly` data available
  return round(delta / numberOfDays);
}

function round(number: number, decimals = 1) {
  const i = 10 ** decimals;
  return Math.round(number * i) / i;
}
