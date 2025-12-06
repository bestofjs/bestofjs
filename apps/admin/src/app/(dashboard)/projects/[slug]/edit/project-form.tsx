"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

import { PROJECT_STATUSES } from "@repo/db/constants";

import { buttonVariants, SubmitButton } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { updateProjectData } from "../actions";

const formSchema = z.object({
  name: z.string().min(2).max(50),
  slug: z.string().min(1),
  description: z.string().min(10).max(500),
  overrideDescription: z.boolean().nullable(),
  url: z.url().or(z.literal("")).nullable(),
  overrideURL: z.boolean().nullable(),
  status: z.enum(PROJECT_STATUSES),
  logo: z.string().nullable(),
  comments: z.string().nullable(),
  twitter: z.string().nullable(),
  packagePath: z.string().nullable(),
});

type FormValues = z.infer<typeof formSchema>;

type Props = {
  project: FormValues & { id: string };
};
export function ProjectForm({ project }: Props) {
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: project,
  });

  const isPending = form.formState.isSubmitting;

  async function onSubmit(values: FormValues) {
    await updateProjectData(project.id, values);
    toast.success("Project updated");
    router.push(`/projects/${values.slug}`);
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle>Project data</CardTitle>
          <CardDescription>
            <code>{project.id}</code>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <Field data-invalid={!!form.formState.errors.name}>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input id="name" placeholder="Name" {...form.register("name")} />
            <FieldError errors={[form.formState.errors.name]} />
          </Field>

          <Field data-invalid={!!form.formState.errors.slug}>
            <FieldLabel htmlFor="slug">Slug</FieldLabel>
            <Input id="slug" placeholder="Slug" {...form.register("slug")} />
            <FieldDescription className="flex items-center gap-2">
              <TriangleAlert className="size-4" />
              Edit with care, the slug may be referenced a lot of places
            </FieldDescription>
            <FieldError errors={[form.formState.errors.slug]} />
          </Field>

          <Field data-invalid={!!form.formState.errors.description}>
            <FieldLabel htmlFor="description">Description</FieldLabel>
            <Input
              id="description"
              placeholder="Description"
              {...form.register("description")}
            />
            <FieldError errors={[form.formState.errors.description]} />
          </Field>

          <Field data-invalid={!!form.formState.errors.overrideDescription}>
            <Controller
              control={form.control}
              name="overrideDescription"
              render={({ field }) => (
                <div className="flex flex-row items-start space-x-3 space-y-0">
                  <Checkbox
                    checked={field.value ?? false}
                    onCheckedChange={field.onChange}
                  />
                  <div className="space-y-1 leading-none">
                    <FieldLabel>Override description</FieldLabel>
                    <FieldDescription>
                      Used to override the description coming from GitHub data
                    </FieldDescription>
                  </div>
                </div>
              )}
            />
            <FieldError errors={[form.formState.errors.overrideDescription]} />
          </Field>

          <Field data-invalid={!!form.formState.errors.logo}>
            <FieldLabel htmlFor="logo">Logo</FieldLabel>
            <Input id="logo" placeholder="Logo" {...form.register("logo")} />
            <FieldError errors={[form.formState.errors.logo]} />
          </Field>

          <Field data-invalid={!!form.formState.errors.url}>
            <FieldLabel htmlFor="url">URL</FieldLabel>
            <Input id="url" placeholder="URL" {...form.register("url")} />
            <FieldError errors={[form.formState.errors.url]} />
          </Field>

          <Field data-invalid={!!form.formState.errors.overrideURL}>
            <Controller
              control={form.control}
              name="overrideURL"
              render={({ field }) => (
                <div className="flex flex-row items-start space-x-3 space-y-0">
                  <Checkbox
                    checked={field.value ?? false}
                    onCheckedChange={field.onChange}
                  />
                  <div className="space-y-1 leading-none">
                    <FieldLabel>Override URL</FieldLabel>
                  </div>
                </div>
              )}
            />
            <FieldError errors={[form.formState.errors.overrideURL]} />
          </Field>

          <Field data-invalid={!!form.formState.errors.status}>
            <FieldLabel>Status</FieldLabel>
            <Controller
              control={form.control}
              name="status"
              render={({ field }) => (
                <Select
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROJECT_STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError errors={[form.formState.errors.status]} />
          </Field>

          <Field data-invalid={!!form.formState.errors.comments}>
            <FieldLabel htmlFor="comments">Comments</FieldLabel>
            <Textarea id="comments" {...form.register("comments")} />
            <FieldError errors={[form.formState.errors.comments]} />
          </Field>

          <Field data-invalid={!!form.formState.errors.packagePath}>
            <FieldLabel htmlFor="packagePath">Package Path</FieldLabel>
            <Input
              id="packagePath"
              placeholder="e.g., packages/core"
              {...form.register("packagePath")}
            />
            <FieldDescription>
              Path to package in monorepos (e.g., <code>packages/react</code>).
              Leave empty for root-level projects.
            </FieldDescription>
            <FieldError errors={[form.formState.errors.packagePath]} />
          </Field>
        </CardContent>
        <CardFooter className="flex justify-end gap-4">
          <Link
            href={`/projects/${project.slug}`}
            className={buttonVariants({ variant: "secondary" })}
          >
            Cancel
          </Link>
          <SubmitButton isPending={isPending}>Save Project</SubmitButton>
        </CardFooter>
      </Card>
    </form>
  );
}
