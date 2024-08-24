"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import { ProjectDetails } from "@repo/db/projects";
import { Tag, TagInput } from "emblor";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import invariant from "tiny-invariant";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { updateProjectTags } from "../actions";

const FormSchema = z.object({
  tags: z.array(
    z.object({
      id: z.string(),
      text: z.string(),
    })
  ),
});

type Props = {
  project: ProjectDetails;
  allTags: Tag[];
};

export function TagsForm({ project, allTags }: Props) {
  const router = useRouter();
  const initialTags = project.projectsToTags
    .map((ptt) => ptt.tag)
    .map((tag) => ({ id: tag.id, text: tag.name }));

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const isPending = form.formState.isSubmitting;

  const [tags, setTags] = React.useState<Tag[]>(initialTags);

  const { setValue } = form;

  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    invariant(project, "Project not found");
    toast.success(`Project updated ${JSON.stringify(data)}`);
    await updateProjectTags(
      project.id,
      project.slug,
      data.tags.map((tag) => tag.id)
    );
    router.push(`/projects/${project.slug}`);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tags</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col items-start space-y-8"
          >
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormControl>
                    <TagInput
                      {...field}
                      activeTagIndex={activeTagIndex}
                      setActiveTagIndex={setActiveTagIndex}
                      placeholder="Enter a topic"
                      tags={tags}
                      className="sm:min-w-[450px]"
                      setTags={(newTags) => {
                        setTags(newTags);
                        setValue("tags", newTags as Tag[]);
                      }}
                      enableAutocomplete
                      autocompleteOptions={allTags}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isPending}>
              {isPending && (
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Tags
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
