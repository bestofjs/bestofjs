import React from "react";
import styled from "@emotion/styled";
import numeral from "numeral";
import slugify from "slugify";

import { Box } from "components/core";
import { StarIcon } from "./icons";

export const DownloadCount = ({ value }) => {
  if (value === undefined) {
    return <div className="star-delta text-secondary text-small">N/A</div>;
  }

  return <span>{numeral(value).format("a")}</span>;
};

const getSign = (value) => {
  if (value === 0) return "";
  return value > 0 ? "+" : "-";
};

const StarDeltaContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const StarDelta = ({ average, ...props }) =>
  // @ts-ignore
  average ? <StarDeltaAverage {...props} /> : <StarDeltaNormal {...props} />;

const StarDeltaNormal = ({ value, ...props }) => {
  const sign = getSign(value);
  return (
    <StarDeltaContainer>
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
    </StarDeltaContainer>
  );
};

const StarDeltaAverageContainer = styled.div`
  text-align: center;
`;

export const StarDeltaAverage = ({ value }) => {
  const integerPart = Math.abs(Math.trunc(value));
  const decimalPart = (Math.abs(value - integerPart) * 10)
    .toFixed()
    .slice(0, 1);
  const sign = getSign(value);

  if (value === undefined)
    return <div className="star-delta text-secondary text-small">N/A</div>;

  return (
    <StarDeltaAverageContainer>
      <StarDeltaContainer>
        <span style={{ marginRight: 2 }}>{sign}</span>
        <span>{integerPart}</span>
        <span className="text-secondary">.{decimalPart}</span>
        <StarIcon fontSize="20px" />
        <span> /day</span>
      </StarDeltaContainer>
    </StarDeltaAverageContainer>
  );
};

export const StarTotal = ({ value }) => {
  return (
    <Span>
      <span>{formatBigNumber(value)}</span>
      <StarIcon fontSize="20px" />
    </Span>
  );
};

// Display a (potentially) big number, either the total number of star or a yearly/monthly delta
// using the `k` prefix
function formatBigNumber(value: number): string {
  const digits = value > 1000 && value < 10000 ? "0.0" : "0";
  return numeral(value).format(digits + " a");
}

const Span = styled.span`
  display: inline-flex;
`;

export function getProjectId(project) {
  return slugify(project.name, { lower: true, remove: /[.'/]/g });
}
