import { Skeleton } from "@/components/ui/skeleton";

export function TagListLoading() {
  return (
    <div>
      <div className="flex items-center py-4">
        <Skeleton className="h-10 w-[300px]" />
      </div>
      <div className="rounded-md border">
        <div className="divide-y">
          {[...Array(10)].map((_, index) => (
            <LoadingTagRow key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

const LoadingTagRow = () => {
  return (
    <div className="flex w-full items-center justify-between gap-4 p-4">
      <div className="flex grow flex-col gap-2">
        <Skeleton className="h-5 w-1/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <Skeleton className="h-6 w-12" />
      <div className="flex gap-3">
        {[...Array(5)].map((_, index) => (
          <Skeleton key={index} className="size-8 rounded" />
        ))}
        <Skeleton className="size-8 rounded" />
      </div>
    </div>
  );
};
