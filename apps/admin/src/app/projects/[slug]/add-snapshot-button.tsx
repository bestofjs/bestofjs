"use client";

import { Button } from "@/components/ui/button";
import { addSnapshotAction } from "./actions";

/**
 * For debugging purpose, add manually a snapshot to the project
 * TODO: should be improve to provide feedback to the user:
 * E.g. "a snapshot already exists for today (N stars)""
 */
export function AddSnapshotButton({
  slug,
  repoId,
  repoFullName,
}: {
  slug: string;
  repoId: string;
  repoFullName: string;
}) {
  return (
    <Button
      size="sm"
      onClick={() => addSnapshotAction(slug, repoId, repoFullName)}
    >
      Add snapshot
    </Button>
  );
}
