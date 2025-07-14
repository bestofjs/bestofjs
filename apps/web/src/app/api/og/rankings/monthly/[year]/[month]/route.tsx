import { ImageLayout } from "@/app/api/og/og-image-layout";
import {
  Box,
  generateImageResponse,
  getProjectRowStyles,
  mutedColor,
  ProjectLogo,
  StarIcon,
} from "@/app/api/og/og-utils";
import { formatMonthlyDate } from "@/app/rankings/monthly/monthly-rankings-utils";
import { formatNumber } from "@/helpers/numbers";
import { api } from "@/server/api-remote-json";

export const runtime = "edge";

type Context = { params: Promise<{ year: string; month: string }> };
export async function GET(_: Request, props: Context) {
  const params = await props.params;
  const NUMBER_OF_PROJECTS = 3;
  const date = parsePageParams(params);
  const { projects } = await api.rankings.getMonthlyRankings({
    date,
    limit: NUMBER_OF_PROJECTS,
  });

  return generateImageResponse(
    <ImageLayout>
      <Box style={{ gap: 32, flexDirection: "column" }}>
        <Box style={{ gap: 16, fontSize: 48 }}>
          <Box>Rankings {formatMonthlyDate(date)}</Box>
        </Box>
        <Box style={{ flexDirection: "column" }}>
          {projects.map((project, index) => (
            <ProjectRow key={project.slug} project={project} index={index} />
          ))}
        </Box>
      </Box>
    </ImageLayout>,
  );
}

function ProjectRow({
  project,
  index,
}: {
  project: BestOfJS.ProjectWithScore;
  index: number;
}) {
  return (
    <Box style={getProjectRowStyles({ isFirst: index === 0 })}>
      <Box style={{ color: mutedColor }}>#{index + 1}</Box>
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
          <ShowStars project={project} />
        </Box>
      </Box>
    </Box>
  );
}

function ShowStars({ project }: { project: BestOfJS.ProjectWithScore }) {
  return (
    <Box style={{ flexDirection: "row", alignItems: "center" }}>
      <Box>{`+${formatNumber(project.score, "compact")}`}</Box>
      <StarIcon />
    </Box>
  );
}

function parsePageParams(params: Awaited<Context["params"]>) {
  const { year, month } = params;
  return { year: parseInt(year), month: parseInt(month) };
}
