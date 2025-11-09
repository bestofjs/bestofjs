"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";

import { addProjectToRepoAction } from "@/actions/projects-actions";
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
  name: z.string().min(2),
  description: z.string().min(10),
});

type Props = {
  repoId: string;
  close: (slug: string) => void;
};

export function AddProjectToRepoDialog({ repoId, close }: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", description: "" },
  });

  const isPending = form.formState.isSubmitting;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const project = await addProjectToRepoAction({ ...values, repoId });
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
            Specify the name of the project to add to this repository
          </DialogDescription>
        </DialogHeader>
        <Field data-invalid={!!form.formState.errors.name}>
          <FieldLabel htmlFor="name">Project name</FieldLabel>
          <Input id="name" placeholder="" {...form.register("name")} />
          <FieldError errors={[form.formState.errors.name]} />
        </Field>
        <Field data-invalid={!!form.formState.errors.description}>
          <FieldLabel htmlFor="description">Description</FieldLabel>
          <Input
            id="description"
            placeholder=""
            {...form.register("description")}
          />
          <FieldError errors={[form.formState.errors.description]} />
        </Field>
        <DialogFooter>
          <SubmitButton isPending={isPending}>Add</SubmitButton>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
