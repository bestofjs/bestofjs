"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import type { ProjectDetails } from "@repo/db/projects";

import { Button, SubmitButton } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useModal } from "@/hooks/use-modal";

import { addPackageAction } from "../actions";

const formSchema = z.object({
  packageName: z.string().refine((value) => {
    const packageNameRegex =
      /^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/;
    return packageNameRegex.test(value);
  }, "Invalid package name"),
});

type Props = {
  project: ProjectDetails;
};

export function AddPackageButton({ project }: Props) {
  const { showModal } = useModal();

  return (
    <Button
      variant="default"
      onClick={async () => {
        await showModal<void>((close) => (
          <AddPackageDialog project={project} close={close} />
        ));
      }}
    >
      <PlusIcon className="size-4" />
      Add Package
    </Button>
  );
}

type DialogProps = {
  project: ProjectDetails;
  close: () => void;
};

function AddPackageDialog({ project, close }: DialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { packageName: "" },
  });

  const isPending = form.formState.isSubmitting;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await addPackageAction(project.id, project.slug, values.packageName);
      toast.success(`Package added: ${values.packageName}`);
      close();
    } catch (error) {
      console.error(error);
      toast.error(`Unable to add the package ${(error as Error).message}`);
    }
  }

  return (
    <DialogContent className="sm:max-w-[600px]">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <DialogHeader>
          <DialogTitle>Add Package</DialogTitle>
          <DialogDescription>
            Specify the package name to be linked to the project
          </DialogDescription>
        </DialogHeader>
        <Field data-invalid={!!form.formState.errors.packageName}>
          <FieldLabel htmlFor="packageName">Package name</FieldLabel>
          <Input
            id="packageName"
            placeholder=""
            {...form.register("packageName")}
          />
          <FieldError errors={[form.formState.errors.packageName]} />
        </Field>
        <DialogFooter>
          <SubmitButton isPending={isPending}>Add</SubmitButton>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
