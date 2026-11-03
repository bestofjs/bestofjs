import { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";

import {
  generateDefaultSlug,
  projectSlugSchema,
} from "@repo/core/shared-schemas";

import { createProjectAction } from "@/actions/projects-actions";
import { SubmitButton } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  gitHubURL: z
    .string()
    .regex(
      /^https:\/\/github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+\/?$/,
      "Enter a valid GitHub repository URL",
    ),
  slug: projectSlugSchema,
});

type Props = {
  close: (slug: string) => void;
};

export function CreateProjectDialog({ close }: Props) {
  const slugEdited = useRef(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { gitHubURL: "", slug: "" },
  });

  const isPending = form.formState.isSubmitting;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const project = await createProjectAction(values.gitHubURL, values.slug);
      toast.success(`Project added: ${project.name}`);
      close(project.slug);
    } catch (error) {
      toast.error(`Unable to create the project ${(error as Error).message}`);
    }
  }

  return (
    <DialogContent className="sm:max-w-[600px]">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <DialogHeader>
          <DialogTitle>Add Project</DialogTitle>
          <DialogDescription>
            Specify the GitHub URL of the project to add
          </DialogDescription>
        </DialogHeader>
        <Field data-invalid={!!form.formState.errors.gitHubURL}>
          <FieldLabel htmlFor="gitHubURL">GitHub URL</FieldLabel>
          <Input
            id="gitHubURL"
            placeholder="https://github.com/..."
            {...form.register("gitHubURL", {
              onChange: (event) => {
                if (slugEdited.current) return;
                const match = event.target.value.match(
                  /^https:\/\/github\.com\/[A-Za-z0-9_.-]+\/([A-Za-z0-9_.-]+)\/?$/,
                );
                const name = match?.[1]?.replace(/\.git$/i, "");
                let slug = "";
                if (name) {
                  try {
                    slug = generateDefaultSlug(name);
                  } catch {
                    // The repository name may not contain slug characters yet.
                  }
                }
                form.setValue("slug", slug, {
                  shouldValidate: form.formState.isSubmitted,
                });
              },
            })}
          />
          <FieldError errors={[form.formState.errors.gitHubURL]} />
        </Field>
        <Field data-invalid={!!form.formState.errors.slug}>
          <FieldLabel htmlFor="slug">Slug</FieldLabel>
          <Input
            id="slug"
            {...form.register("slug", {
              onChange: () => {
                slugEdited.current = true;
              },
            })}
          />
          <FieldError errors={[form.formState.errors.slug]} />
        </Field>
        <DialogFooter>
          <SubmitButton isPending={isPending}>Add</SubmitButton>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
