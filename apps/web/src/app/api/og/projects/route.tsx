import {
  Box,
  generateImageResponse,
  getProjectRowStyles,
  mutedColor,
  ProjectLogo,
  StarIcon,
  TagIcon,
} from "@/app/api/og/og-utils";
import { ProjectSearchStateParser } from "@/app/projects/project-search-state";
import { getDeltaByDay } from "@/components/core";
import {
  getSortOptionByKey,
  type SortOption,
  type SortOptionKey,
} from "@/components/project-list/sort-order-options";
import { formatNumber } from "@/helpers/numbers";
import { getSearchParamsKeyValues } from "@/lib/url-search-params";
import { api } from "@/server/api-remote-json";

import { ImageLayout } from "../og-image-layout";

const searchStateParser = new ProjectSearchStateParser();

export async function GET(req: Request) {
  const NUMBER_OF_PROJECTS = 3;
  const {
    searchState: { tags, query, sort, page },
  } = getSearchStateFromURL(req.url);
  const sortOption = getSortOptionByKey(sort);
  const { projects, selectedTags } = await api.projects.findProjects({
    criteria: tags.length > 0 ? { tags: { $all: tags } } : {},
    query,
    sort: sortOption.sort,
    skip: NUMBER_OF_PROJECTS * (page - 1),
    limit: NUMBER_OF_PROJECTS,
  });

  return generateImageResponse(
    <ImageLayout>
      <Box style={{ gap: 32, flexDirection: "column" }}>
        <ImageCaption
          tags={selectedTags}
          query={query}
          sortOption={sortOption}
        />
        <Box style={{ flexDirection: "column" }}>
          {projects.map((project, index) => (
            <ProjectRow
              key={project.slug}
              project={project}
              index={index}
              sortOption={sortOption}
            />
          ))}
        </Box>
      </Box>
    </ImageLayout>,
  );
}

function getImageTitle(tags: BestOfJS.Tag[], query?: string) {
  if (!query && tags.length === 0) {
    return "All Projects";
  }
  if (!query && tags.length > 0) {
    return tags.map((tag) => tag.name).join(" + ");
  }
  return "Search results";
}

function getSearchStateFromURL(url: string) {
  const { searchParams } = new URL(url);
  const projectSearchParams = getSearchParamsKeyValues(searchParams);
  return searchStateParser.parse(projectSearchParams);
}

function ImageCaption({
  tags,
  query,
  sortOption,
}: {
  tags: BestOfJS.Tag[];
  query?: string;
  sortOption: SortOption;
}) {
  return (
    <Box style={{ gap: 16, alignItems: "center" }}>
      {tags.length > 0 && !query && (
        <Box style={{ paddingLeft: 5, color: "#F59E0B" }}>
          <TagIcon className="size-[1.75em]" />
        </Box>
      )}
      <Box style={{ flexDirection: "column", paddingLeft: 0 }}>
        <Box style={{ fontSize: 48 }}>{getImageTitle(tags, query)}</Box>
        <Box style={{ fontSize: 32, color: mutedColor }}>
          {sortOption.label}
        </Box>
      </Box>
    </Box>
  );
}

function ProjectRow({
  project,
  sortOption,
  index,
}: {
  project: BestOfJS.Project;
  sortOption: SortOption;
  index: number;
}) {
  return (
    <Box style={getProjectRowStyles({ isFirst: index === 0 })}>
      <Box>
        <ProjectLogo project={project} size={80} />
      </Box>
      <Box
        style={{
          justifyContent: "space-between",
          flex: 1,
        }}
      >
        <Box>{project.name}</Box>
        <Box>
          <ProjectScore project={project} sortOptionKey={sortOption.key} />
        </Box>
      </Box>
    </Box>
  );
}

function ProjectScore({
  project,
  sortOptionKey,
}: {
  project: BestOfJS.Project;
  sortOptionKey: SortOptionKey;
}) {
  const { contributor_count, created_at, downloads, trends } = project;
  switch (sortOptionKey) {
    case "daily":
      return trends.daily ? (
        <ShowStarsTotal value={trends.daily} showPrefix />
      ) : null;
    case "weekly":
      return trends.weekly ? (
        <ShowStarsAverage value={getDeltaByDay("weekly")(project)} />
      ) : null;
    case "monthly":
      return trends.monthly ? (
        <ShowStarsAverage value={getDeltaByDay("monthly")(project)} />
      ) : null;
    case "yearly":
      return trends.yearly ? (
        <ShowStarsAverage value={getDeltaByDay("yearly")(project)} />
      ) : null;
    case "monthly-downloads":
      return <Box>{formatNumber(downloads, "compact")}</Box>;
    case "contributors":
      return <Box>{formatNumber(contributor_count, "compact")}</Box>;
    case "created":
      return <Box>{created_at}</Box>;
    default:
      return <ShowStarsTotal value={project.stars} />;
  }
}

function ShowStarsTotal({
  value,
  showPrefix,
}: {
  value: number;
  showPrefix?: boolean;
}) {
  return (
    <Box style={{ flexDirection: "row", alignItems: "center" }}>
      <Box>
        {showPrefix && value > 0 ? "+" : ""}
        {formatNumber(value, "compact")}
      </Box>
      <StarIcon />
    </Box>
  );
}

function ShowStarsAverage({ value }: { value?: number }) {
  if (value === undefined) return null;
  return (
    <Box style={{ flexDirection: "row", alignItems: "center" }}>
      {value > 0 ? "+" : ""}
      <Box>{formatNumber(value, "compact")}</Box>
      <StarIcon />
      <Box style={{ color: mutedColor }}>/day</Box>
    </Box>
  );
}
