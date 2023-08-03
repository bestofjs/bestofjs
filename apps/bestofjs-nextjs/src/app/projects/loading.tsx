import { Card, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeading } from "@/components/core/typography";

export default function ProjectListLoading() {
  return (
    <>
      <PageHeading title={<>Projects</>} />
      <Card>
        <CardHeader className="border-b text-muted-foreground">
          Loading project list...
        </CardHeader>
        <div className="divide-y">
          {[...Array(5)].map((i) => (
            <LoadingProject key={i} />
          ))}
        </div>
      </Card>
    </>
  );
}

const LoadingProject = () => {
  return (
    <div className="flex w-full flex-row">
      <div className="flex items-center p-4">
        <Skeleton className="h-[50px] w-[50px] p-4" />
      </div>
      <div className="grow space-y-4 p-4">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
};
