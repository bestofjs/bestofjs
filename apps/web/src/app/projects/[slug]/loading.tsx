import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectDetailsLoading() {
  return (
    <div
      className="flex flex-col space-y-8 font-serif"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">Loading project details...</span>
      <ProjectHeaderLoading />
      <ProjectCardLoading />
      <ProjectCardLoading />
    </div>
  );
}

function ProjectHeaderLoading() {
  return (
    <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:divide-x">
      <div className="grid grow auto-cols-[auto_1fr] grid-flow-col items-stretch divide-x">
        <div className="flex items-center pr-4">
          <Skeleton className="size-18.75" />
        </div>
        <div className="flex flex-col justify-center space-y-4 px-4">
          <Skeleton className="h-10 w-48 max-w-full" />
          <Skeleton className="h-5 w-96 max-w-full" />
          <div className="flex gap-2">
            <Skeleton className="h-7 w-20" />
            <Skeleton className="h-7 w-24" />
          </div>
        </div>
      </div>
      <aside className="flex flex-col justify-center space-y-2 sm:w-70 sm:pl-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </aside>
    </div>
  );
}

function ProjectCardLoading() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-48 w-full" />
      </CardContent>
    </Card>
  );
}
