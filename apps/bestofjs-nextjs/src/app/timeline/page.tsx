import { PageHeading } from "@/components/core/typography";
import { api } from "@/server/api";
import { timelineProjects } from "./timeline-projects";

export default async function TimelinePage() {
  const slugs = timelineProjects.map(({ slug }) => slug);
  const foundProjects = await api.projects.findProjects({
    criteria: { slug: { $in: slugs } },
  });
  // const projects = timelineProjects.map(({ slug, date, comments }) => {});
  return (
    <>
      <PageHeading title="Timeline" />
      <p>Coming soon!</p>
      {JSON.stringify(foundProjects, null, 2)}
    </>
  );
}
