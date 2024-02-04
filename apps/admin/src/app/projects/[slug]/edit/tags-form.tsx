"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import invariant from "tiny-invariant";
import { z } from "zod";

import { getProjectBySlug } from "@/database/projects/get";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tag, TagInput } from "@/components/ui/tags/tag-input";

import { updateProjectTags } from "../actions";

const FormSchema = z.object({
  tags: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
    })
  ),
});

type Props = {
  project: Required<Awaited<ReturnType<typeof getProjectBySlug>>>;
  allTags: Tag[];
};

export function TagsForm({ project, allTags }: Props) {
  invariant(project, "Project not found");
  const initialTags = project.projectsToTags.map((ptt) => ptt.tag);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const [tags, setTags] = React.useState<Tag[]>(initialTags);

  const { setValue } = form;

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    toast.success(`Project updated ${JSON.stringify(data)}`);
    await updateProjectTags(project.id, project.slug, data.tags);
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
            className="space-y-8 flex flex-col items-start"
          >
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormControl>
                    <TagInput
                      {...field}
                      placeholder="Enter a topic"
                      tags={tags}
                      className="sm:min-w-[450px]"
                      setTags={(newTags) => {
                        setTags(newTags);
                        setValue("tags", newTags as [Tag, ...Tag[]]);
                      }}
                      enableAutocomplete
                      autocompleteOptions={allTags}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
