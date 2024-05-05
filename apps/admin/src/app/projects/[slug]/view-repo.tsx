import * as schema from "@/database/schema";
import { formatDateOnly, formatStars } from "@/lib/format-helpers";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Props = {
  repo: typeof schema.repos.$inferSelect;
};
export function ViewRepo({ repo }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between">
          <div>GitHub Repository</div>
          <div>{formatStars(repo.stars)}</div>
        </CardTitle>
        <CardDescription>
          <code>{repo.id}</code>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-[200px_1fr] gap-4">
          <p>Full Name</p>
          <p>{repo.full_name}</p>
          <p>Description</p>
          <p>{repo.description}</p>
          <p>Created</p>
          <p>{formatDateOnly(repo.created_at)}</p>
          <p>Pushed at</p>
          <p>{formatDateOnly(repo.pushed_at)}</p>
          <p>Commit count</p>
          <p>{repo.commit_count}</p>
          <p>Contributors</p>
          <p>{repo.contributor_count}</p>
        </div>
      </CardContent>
    </Card>
  );
}
