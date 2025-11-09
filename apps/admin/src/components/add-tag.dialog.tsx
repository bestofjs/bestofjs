"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";

import { createTag } from "@/actions/tags-actions";
import { SubmitButton } from "@/components/ui/button";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  name: z.string(),
});

type Props = {
  close: (code: string) => void;
};

export function AddTagDialog({ close }: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "" },
  });

  const isPending = form.formState.isSubmitting;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const tag = await createTag(values.name);
      toast.success(`Tag added: ${tag.code}`);
      close(tag.code);
    } catch (error) {
      toast.error(`Unable to create the tag ${(error as Error).message}`);
    }
  }

  return (
    <DialogContent className="sm:max-w-[600px]">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <DialogHeader>
          <DialogTitle>Add Tag</DialogTitle>
        </DialogHeader>
        <Field data-invalid={!!form.formState.errors.name}>
          <FieldLabel htmlFor="name">Name</FieldLabel>
          <Input id="name" placeholder="" {...form.register("name")} />
          <FieldError errors={[form.formState.errors.name]} />
        </Field>
        <DialogFooter>
          <SubmitButton isPending={isPending}>Add</SubmitButton>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
