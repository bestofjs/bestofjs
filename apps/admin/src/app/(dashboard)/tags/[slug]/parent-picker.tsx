"use client";

import { useState, useTransition } from "react";

import { updateTagParent } from "@/actions/tags-actions";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ParentOption = { id: string; name: string; code: string };

export function ParentPicker({
  tagId,
  parentTagId,
  candidates,
}: {
  tagId: string;
  parentTagId: string | null;
  candidates: ParentOption[];
}) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <Field>
      <FieldLabel htmlFor="parent-tag">Parent tag</FieldLabel>
      <Select
        disabled={isPending}
        value={parentTagId ?? "none"}
        onValueChange={(value) => {
          setError(null);
          startTransition(async () => {
            const result = await updateTagParent(
              tagId,
              value === "none" ? null : value,
            );
            setError(result.error);
          });
        }}
      >
        <SelectTrigger id="parent-tag">
          <SelectValue placeholder="No parent" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">No parent</SelectItem>
          {candidates.map((candidate) => (
            <SelectItem key={candidate.id} value={candidate.id}>
              {candidate.name} ({candidate.code})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-muted-foreground text-sm">
        Only facet-valid, cycle-free parents are shown.
      </p>
      {error ? (
        <p className="text-destructive text-sm" role="alert">
          {error}
        </p>
      ) : null}
    </Field>
  );
}
