import {
  OneYearSnapshots,
  ProjectDetails,
  getProjectMonthlyTrends,
  getProjectTrends,
} from "@repo/db/projects";
import { GoGitCommit } from "react-icons/go";
import { MdGroup } from "react-icons/md";

import { fromNow } from "@/helpers/from-now";
import { formatNumber } from "@/helpers/numbers";
import { Card, CardBody, CardContent, CardHeader } from "@/components/ui/card";
import {
  ExternalLinkIcon,
  GitHubIcon,
  StarDelta,
  StarIcon,
  StarTotal,
  getDeltaByDay,
} from "@/components/core";
import { ExternalLink } from "@/components/core/typography";

import { MonthlyTrendsChart } from "./monthly-trends-chart";

type Props = {
  project: ProjectDetails;
};
export const ProjectDetailsGitHubCard = ({ project }: Props) => {
  const {
    repo: { stars, snapshots },
  } = project;
  const monthlyTrends = getProjectMonthlyTrends(snapshots);

  return (
    <Card>
      <CardHeader className="border-b">
        <div className="flex items-center space-x-2">
          <div>
            <GitHubIcon size={24} />
          </div>
          <div>GitHub</div>
          <StarTotal value={stars || 0} />
        </div>
      </CardHeader>
      <CardBody>
        <CardContent>
          <GitHubData project={project} />
        </CardContent>
        {monthlyTrends.length > 1 && (
          <CardContent>
            <GitHubMonthlyTrends trends={monthlyTrends} />
          </CardContent>
        )}
        <CardContent>
          <GitHubTrendsSummary snapshots={snapshots} />
        </CardContent>
      </CardBody>
    </Card>
  );
};

const GitHubData = ({ project }: { project: ProjectDetails }) => {
  const {
    repo: { commit_count, contributor_count, created_at, full_name, pushed_at },
  } = project;
  const url = `https://github.com${full_name}`;

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <ExternalLink url={url} className="flex items-center gap-1 font-sans">
          {full_name}
          <ExternalLinkIcon size={16} />
        </ExternalLink>
      </div>
      <div>
        {created_at && (
          <>
            Created {fromNow(created_at)}, last commit {fromNow(pushed_at)}
          </>
        )}
      </div>
      <div className="flex gap-2">
        <MdGroup size={20} className="icon" />
        {contributor_count ? (
          <>{formatNumber(contributor_count, "compact")} contributors</>
        ) : (
          <span className="text-muted-foreground">
            Number of contributors not available
          </span>
        )}
      </div>
      <div className="flex gap-2">
        {commit_count && (
          <>
            <GoGitCommit size={20} className="icon" />
            {formatNumber(commit_count, "compact")} commits
          </>
        )}
      </div>
    </div>
  );
};

export const GitHubMonthlyTrends = ({
  trends,
}: {
  trends: { year: number; month: number; delta: number }[];
}) => {
  const results = trends.map(({ year, month, delta }) => ({
    year,
    month,
    value: delta,
  }));
  return (
    <>
      <div className="mb-2">Stars added on GitHub, month by month</div>
      <MonthlyTrendsChart results={results} unit="stars" showPlusSymbol />
    </>
  );
};

type SummaryItem = {
  label: string;
  category: keyof BestOfJS.ProjectDetails["trends"];
};
const summaryItems: SummaryItem[] = [
  { label: "Yesterday", category: "daily" },
  { label: "Last week", category: "weekly" },
  { label: "Last month", category: "monthly" },
  { label: "Last 12 months", category: "yearly" },
];

const GitHubTrendsSummary = ({
  snapshots,
}: {
  snapshots: OneYearSnapshots[];
}) => {
  const trends = getProjectTrends(snapshots);
  const items = summaryItems.filter(({ category }) => {
    const value = trends[category];
    return value !== undefined && value !== null;
  });

  return (
    <>
      {trends.weekly || trends.weekly === 0 ? (
        <div>
          <div className="mb-4">Stars added on GitHub, per day, on average</div>
          <div className="flex w-full flex-col sm:flex-row">
            {items.map((item, i) => (
              <MonthlyTrendsItem item={item} key={i} trends={trends} />
            ))}
          </div>
        </div>
      ) : (
        <OnlyYesterday trends={trends} />
      )}
    </>
  );
};

const OnlyYesterday = ({
  trends,
}: {
  trends: BestOfJS.ProjectDetails["trends"];
}) => {
  const value = trends.daily;
  if (value === undefined) return null;
  if (value === 0) return <div>No star added on GitHub yesterday</div>;
  return value > 0 ? (
    <div style={{ display: "flex", alignItems: "center" }}>
      {value}
      <StarIcon /> added yesterday
    </div>
  ) : (
    <div>
      {value}
      <StarIcon /> lost yesterday
    </div>
  );
};

const MonthlyTrendsItem = ({
  item,
  trends,
}: {
  item: SummaryItem;
  trends: BestOfJS.ProjectDetails["trends"];
}) => {
  const { label, category } = item;
  const value = getDeltaByDay(category)({ trends });
  if (value === undefined) return null;
  return (
    <div className="mt-2 flex-1 justify-center text-center sm:mt-0">
      <div>{label}</div>
      <div className="flex justify-center">
        <StarDelta value={value} average={category !== "daily"} />
      </div>
    </div>
  );
};
