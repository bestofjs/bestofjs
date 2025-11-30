import { PageHeading } from "@/components/core/typography";
import { Card, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ProjectListLoading() {
  return (
    <>
      <PageHeading title={<>Projects</>} />
      <ProjectListCardLoading />
    </>
  );
}

export function ProjectListCardLoading({
  numberOfProjects = 5,
}: {
  numberOfProjects?: number;
}) {
  return (
    <Card>
      <CardHeader className="border-b text-muted-foreground">
        Loading projects...
      </CardHeader>
      <div className="divide-y">
        {[...Array(numberOfProjects)].map((_, index) => (
          <LoadingProject key={index} />
        ))}
      </div>
    </Card>
  );
}

const LoadingProject = () => {
  return (
    <div className="flex w-full flex-row">
      <div className="flex items-center p-4">
        <Skeleton className="size-[50px] p-4" />
      </div>
      <div className="grow space-y-4 p-4">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
};
