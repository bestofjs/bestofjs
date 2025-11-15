"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

import type { getTagBySlug } from "@repo/db/tags";

import { updateTagData } from "@/app/(dashboard)/projects/[slug]/actions";
import { SubmitButton } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  name: z.string(),
  code: z.string().toLowerCase().trim(),
  description: z.string().nullable(),
});

type Props = {
  tag: Exclude<Awaited<ReturnType<typeof getTagBySlug>>, undefined>;
};

export function TagForm({ tag }: Props) {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    ...{
      defaultValues: {
        ...tag,
        description: tag.description ?? "",
      },
    },
  });

  const isPending = form.formState.isSubmitting;

  async function onSubmit(data: z.infer<typeof formSchema>) {
    console.log("Submit", data);
    await updateTagData(tag.id, data);
    toast.success("Tag updated");
    router.push("/tags");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tag data</CardTitle>
        {tag && (
          <CardDescription>
            <code>{tag.id}</code>
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
          <Field data-invalid={!!form.formState.errors.name}>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input id="name" placeholder="Name" {...form.register("name")} />
            <FieldError errors={[form.formState.errors.name]} />
          </Field>
          <Field data-invalid={!!form.formState.errors.code}>
            <FieldLabel htmlFor="code">Code</FieldLabel>
            <Input id="code" placeholder="Code" {...form.register("code")} />
            <FieldError errors={[form.formState.errors.code]} />
          </Field>
          <Field data-invalid={!!form.formState.errors.description}>
            <FieldLabel htmlFor="description">Description</FieldLabel>
            <Textarea
              id="description"
              placeholder="Description"
              {...form.register("description")}
            />
            <FieldError errors={[form.formState.errors.description]} />
          </Field>

          <SubmitButton isPending={isPending}>Save</SubmitButton>
        </form>
      </CardContent>
    </Card>
  );
}
