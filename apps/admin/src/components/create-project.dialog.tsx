import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import { toast } from "sonner";
import { z } from "zod";

import { createProjectAction } from "@/actions/projects-actions";
import { Button } from "@/components/ui/button";
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
  gitHubURL: z.url().startsWith("https://github.com/"),
});

type Props = {
  close: (slug: string) => void;
};

export function CreateProjectDialog({ close }: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { gitHubURL: "" },
  });

  const isPending = form.formState.isSubmitting;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const project = await createProjectAction(values.gitHubURL);
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
            {...form.register("gitHubURL")}
          />
          <FieldError errors={[form.formState.errors.gitHubURL]} />
        </Field>
        <DialogFooter>
          <Button type="submit" disabled={isPending}>
            {isPending && <ReloadIcon className="mr-2 size-4 animate-spin" />}
            Add
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
