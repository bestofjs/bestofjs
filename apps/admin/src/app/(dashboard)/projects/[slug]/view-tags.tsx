"use client";

import { useState } from "react";
import { XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import type { ProjectDetails } from "@repo/db/projects";

import { TagPicker } from "@/components/tag-picker";
import { Badge } from "@/components/ui/badge";
import { Button, SubmitButton } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { updateProjectTags } from "./actions";

type Props = {
  project: ProjectDetails;
  allTags: ProjectDetails["tags"];
};

/**
 * Show the current tags and let users edit them
 * TODO simplify the logic by changing the URL when editing?
 **/
export function ViewTags({ project, allTags }: Props) {
  const router = useRouter();

  const initialValues = project.tags.map((tag) => tag.id);
  const [isPending, setIsPending] = useState(false);

  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(initialValues);

  const selectedTags = allTags.filter((tag) => selectedTagIds.includes(tag.id));
  const isChanged = !areSameTags(selectedTagIds, initialValues) && !isPending;

  async function handleSave() {
    setIsPending(true);
    try {
      await updateProjectTags(project.id, project.slug, selectedTagIds);
      toast.success(`Project tags updated!`);
      router.refresh();
    } catch (error) {
      toast.error(`Failed to update project tags: ${(error as Error).message}`);
    } finally {
      setIsPending(false);
    }
  }

  function handleDiscard() {
    setSelectedTagIds(initialValues);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Tags
          {selectedTagIds.length > 0 && (
            <Badge variant="default">{selectedTagIds.length}</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center gap-2">
          {selectedTags.map((tag) => (
            <Badge variant="secondary" className="text-sm" key={tag.id}>
              {tag.name}
              <Button
                size="icon"
                variant="ghost"
                onClick={() => {
                  setSelectedTagIds((prev) =>
                    prev.filter((id) => id !== tag.id),
                  );
                }}
              >
                <XIcon className="size-4" />
              </Button>
            </Badge>
          ))}
          <TagPicker
            allTags={allTags}
            values={selectedTagIds}
            onChange={setSelectedTagIds}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-4">
        <Button
          disabled={!isChanged}
          onClick={handleDiscard}
          variant="secondary"
        >
          Discard
        </Button>
        <SubmitButton
          type="button"
          isPending={isPending}
          disabled={!isChanged}
          onClick={handleSave}
        >
          Save
        </SubmitButton>
      </CardFooter>
    </Card>
  );
}

/** Compare two arrays of tags ignoring the order */
function areSameTags(tagsA: string[], tagB: string[]) {
  return tagToString(tagsA) === tagToString(tagB);
}

function tagToString(values: string[]) {
  return values.slice().sort().join(",");
}
