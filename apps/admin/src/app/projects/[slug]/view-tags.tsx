import invariant from "tiny-invariant";

import { getProjectBySlug } from "@/database/projects/get";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tag } from "@/components/ui/tags/tag-input";
import { TagPicker } from "@/components/tag-picker";

type Props = {
  project: Required<Awaited<ReturnType<typeof getProjectBySlug>>>;
  allTags: Tag[];
};
export function ViewTags({ project, allTags }: Props) {
  invariant(project, "Project not found");
  const tags = project.projectsToTags.map((ptt) => ptt.tag);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tags</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge variant="secondary" key={tag.id}>
              {tag.name}
            </Badge>
          ))}
          <TagPicker allTags={allTags} />
        </div>
      </CardContent>
    </Card>
  );
}
