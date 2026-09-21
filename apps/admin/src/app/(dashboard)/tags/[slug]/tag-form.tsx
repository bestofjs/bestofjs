"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

import type { getTagBySlug } from "@repo/core/services/tags";
import { TAG_FACETS } from "@repo/core/services/tags/taxonomy";

import { updateTagData } from "@/actions/tags-actions";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  name: z.string(),
  code: z.string().toLowerCase().trim(),
  description: z.string().nullable(),
  facet: z.enum(TAG_FACETS).nullable(),
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
        facet: tag.facet,
      },
    },
  });

  const isPending = form.formState.isSubmitting;

  async function onSubmit(data: z.infer<typeof formSchema>) {
    console.log("Submit", data);
    const result = await updateTagData(tag.id, data);
    if (result.error) {
      form.setError("root", { message: result.error });
      return;
    }
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
          <Field data-invalid={!!form.formState.errors.facet}>
            <FieldLabel htmlFor="facet">Facet</FieldLabel>
            <Select
              value={form.watch("facet") ?? "none"}
              onValueChange={(value) =>
                form.setValue(
                  "facet",
                  value === "none"
                    ? null
                    : (value as (typeof TAG_FACETS)[number]),
                  { shouldDirty: true },
                )
              }
            >
              <SelectTrigger id="facet">
                <SelectValue placeholder="No facet" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No facet</SelectItem>
                {TAG_FACETS.map((facet) => (
                  <SelectItem key={facet} value={facet}>
                    {facet}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError errors={[form.formState.errors.facet]} />
          </Field>

          {form.formState.errors.root?.message ? (
            <Alert variant="destructive">
              <AlertDescription>
                {form.formState.errors.root.message}
              </AlertDescription>
            </Alert>
          ) : null}

          <SubmitButton isPending={isPending}>Save</SubmitButton>
        </form>
      </CardContent>
    </Card>
  );
}
