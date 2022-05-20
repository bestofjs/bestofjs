import numeral from "numeral";

import { Box, Center } from "components/core";
import { StarIcon } from "./icons";

type Props = {
  value: number;
};

export const DownloadCount = ({ value }: Props) => {
  if (value === undefined) {
    return <div className="star-delta text-secondary text-small">N/A</div>;
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

const StarDeltaNormal = ({ value, ...props }: Props) => {
  const sign = getSign(value);
  return (
    <Center>
      {value === 0 ? (
        "="
      ) : (
        <>
          <Box as="span" mr="2px">
            {sign}
          </Box>
          <span>{formatBigNumber(Math.abs(value))}</span>
          <StarIcon fontSize="20px" {...props} />
        </>
      )}
    </Center>
  );
};

export const StarDeltaAverage = ({ value }: Props) => {
  const integerPart = Math.abs(Math.trunc(value));
  const decimalPart = (Math.abs(value - integerPart) * 10)
    .toFixed()
    .slice(0, 1);
  const sign = getSign(value);

  if (value === undefined)
    return <div className="star-delta text-secondary text-small">N/A</div>;

  return (
    <Center>
      <span>{sign}</span>
      <span>{integerPart}</span>
      <span className="text-secondary">.{decimalPart}</span>
      <StarIcon fontSize="20px" />
      <span> /day</span>
    </Center>
  );
};

export const StarTotal = ({ value }: Props) => {
  return (
    <Box display="inline-flex">
      <span>{formatBigNumber(value)}</span>
      <StarIcon fontSize="20px" />
    </Box>
  );
};

// Display a (potentially) big number, either the total number of star or a yearly/monthly delta
// using the `k` prefix
function formatBigNumber(value: number): string {
  const digits = value > 1000 && value < 10000 ? "0.0" : "0";
  return numeral(value).format(digits + " a");
}

export function getProjectId(project: BestOfJS.Project) {
  return slugify(project.name);
}

export function slugify(source: string) {
  return source
    .trim()
    .replace(/\W/g, replaceSpecialChar)
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

function replaceSpecialChar(char: string) {
  return charMap.has(char) ? (charMap.get(char) as string) : "-";
}

const charMap = new Map([
  [".", ""],
  ["'", ""],
  ["&", "and"],
  ["$", "$"], // keep `$` characters (for `$mol` project)
]);

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

    const delta = trends[period];
    const numberOfDays = periods[period];
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
