import { PageHeading } from "@/components/core/typography";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const memberNames = ["Evan", "Dan", "Sindre", "Ryan", "Kent", "TJ"];

export default function HallOfFameLoading() {
  return (
    <>
      <PageHeading
        title={<>JavaScript Hall of Fame</>}
        subtitle={
          <>
            Loading the greatest developers, authors and speakers of the
            JavaScript community...
            <br />
            {memberNames.join(", ")}... and many more!
          </>
        }
      />
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {memberNames.map((name) => (
          <HallOfFameSkeletonCard key={name} name={name} />
        ))}
      </div>
    </>
  );
}

export function HallOfFameSkeletonCard({ name }: { name: string }) {
  return (
    <Card className="sm:rounded-none">
      <div className="flex border-b">
        <Skeleton className="size-[100px] rounded-none" />
        <div className="flex flex-1 items-center px-4 text-muted text-xl">
          {name}
        </div>
      </div>
      <div className="flex gap-4 p-4">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-5 w-20" />
      </div>
    </Card>
  );
}
