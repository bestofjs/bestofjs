import { formatNumber } from "@/helpers/numbers";

import { StarIcon } from "./icons";

type Props = {
  value: number;
};

export function DownloadCount({ value }: Props) {
  if (value === undefined) {
    return <div className="star-delta text-sm">N/A</div>;
  }

  return <span>{formatNumber(value, "compact")}</span>;
}

function getSign(value: number) {
  if (value === 0) return "";
  return value > 0 ? "+" : "-";
}

export function StarDelta({
  average,
  ...props
}: Props & { average?: boolean }) {
  return average ? (
    <StarDeltaAverage {...props} />
  ) : (
    <StarDeltaNormal {...props} />
  );
}

function StarDeltaNormal({ value }: Props) {
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
}

/** Display: integer when |value| >= 100; one decimal when |value| < 100. */
function formatAverageStarDeltaMagnitude(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 100) {
    return String(Math.round(abs));
  }
  return (Math.round(abs * 10) / 10).toFixed(1);
}

export function StarDeltaAverage({ value }: Props) {
  if (value === undefined)
    return <div className="star-delta text-muted-foreground text-sm">N/A</div>;

  const sign = getSign(value);
  const magnitude = formatAverageStarDeltaMagnitude(value);

  return (
    <div className="inline-flex items-center whitespace-nowrap">
      <div>
        <span>{sign}</span>
        <span>{magnitude}</span>
      </div>
      <div className="inline-flex items-center whitespace-nowrap">
        <StarIcon />
        <span> /day</span>
      </div>
    </div>
  );
}

export function StarTotal({ value }: Props) {
  return (
    <div className="inline-flex items-center">
      <span>{formatNumber(value, "compact")}</span>
      <StarIcon />
    </div>
  );
}

export function getDeltaByDay(period: string) {
  function deltaForProject({ trends }: { trends: BestOfJS.Project["trends"] }) {
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
  }

  return deltaForProject;
}

function average(delta: number | undefined, numberOfDays: number) {
  if (delta === undefined) return undefined; // handle recently added projects, without `yearly`, `monthly` data available
  return round(delta / numberOfDays);
}

function round(number: number, decimals = 1) {
  const i = 10 ** decimals;
  return Math.round(number * i) / i;
}
