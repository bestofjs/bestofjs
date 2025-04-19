import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function TagListLoading() {
  return (
    <Card>
      <CardHeader className="border-b text-muted-foreground">
        Loading all tags...
      </CardHeader>
      <CardContent>
        {[...Array(10)].map((_, index) => (
          <LoadingTag key={index} />
        ))}
      </CardContent>
    </Card>
  );
}

const LoadingTag = () => {
  return (
    <div className="flex w-full flex-col justify-between gap-4 p-4 md:flex-row">
      <div className="grow">
        <Skeleton className="h-8 w-1/2" />
      </div>
      <div className="flex gap-4">
        {[...Array(5)].map((_, index) => (
          <Skeleton key={index} className="size-8" />
        ))}
      </div>
    </div>
  );
};
