import React from "react";
import Toggle from "react-toggled";
import styled from "@emotion/styled";

import { ExpandableSection } from "./expandable-section";
import { MonthlyChart } from "../monthly-bar-chart";
import { useFetchMonthlyDownloads } from "../../../api/hooks";
import { Spinner } from "../../core";
import { DownloadCount } from "../../core/project";

export const MonthlyDownloadChart = ({ project, ...rest }) => {
  return (
    <Toggle>
      {({ on, getTogglerProps }) => (
        <div {...rest}>
          <ExpandableSection on={on} getTogglerProps={getTogglerProps}>
            Monthly downloads on NPM
            {!on && project.downloads !== undefined && (
              <Preview>
                Last 30 days: <DownloadCount value={project.downloads} />
              </Preview>
            )}
          </ExpandableSection>
          {on && <FetchDownloadCharts project={project} />}
        </div>
      )}
    </Toggle>
  );
};

const Preview = styled.span`
  color: var(--textSecondaryColor);
  margin-left: 0.5rem;
`;

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

  const values = data.map(({ year, month, downloads }) => ({
    year,
    month,
    value: downloads,
  }));

  return (
    <div>
      <Chart values={values} />
    </div>
  );
};

const Chart = ({ values }) => {
  return <MonthlyChart values={values} showPlusSymbol={false} />;
};
