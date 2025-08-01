"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import { PlusIcon } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import type { ProjectDetails } from "@repo/db/projects";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { packageName: "" },
  });

  const isPending = form.formState.isSubmitting;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await addPackageAction(project.id, project.slug, values.packageName);
      toast.success(`Package added: ${values.packageName}`);
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast.error(`Unable to add the package ${(error as Error).message}`);
    }
  }

  return (
    <Form {...form}>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="default">
            <PlusIcon className="size-4" />
            Add Package
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <DialogHeader>
              <DialogTitle>Add Package</DialogTitle>
              <DialogDescription>
                Specify the package name to be linked to the project
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-[100px_1fr] items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Package name
              </Label>
              <FormField
                control={form.control}
                name="packageName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending && (
                  <ReloadIcon className="mr-2 size-4 animate-spin" />
                )}
                Add
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Form>
  );
}
