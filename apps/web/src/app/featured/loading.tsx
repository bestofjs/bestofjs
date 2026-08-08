import { ProjectListCardLoading } from "@/app/projects/loading-state";
import { StarIcon } from "@/components/core";
import { PageHeading } from "@/components/core/typography";

export default function FeaturedProjectsLoading() {
  return (
    <>
      <PageHeading
        icon={<StarIcon className="size-9" />}
        title={<>Featured Projects</>}
        subtitle={<>A collection of awesome projects chosen by our team!</>}
      />
      <ProjectListCardLoading />
    </>
  );
}
