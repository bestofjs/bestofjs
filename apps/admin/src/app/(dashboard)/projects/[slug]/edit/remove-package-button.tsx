"use client";

import { useState } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { toast } from "sonner";

import { ProjectDetails } from "@repo/db/projects";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { removePackageAction } from "../actions";

type Props = {
  project: ProjectDetails;
  packageName: string;
};

export function RemovePackageButton({ project, packageName }: Props) {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log("Removing package", packageName);

    try {
      setIsPending(true);
      await removePackageAction(project.id, project.slug, packageName);
      toast.success(`Package removed: ${packageName}`);
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast.error(`Unable to add the package ${(error as Error).message}`);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">Remove Package</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]" aria-describedby={undefined}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <DialogHeader>
            <DialogTitle>Remove Package</DialogTitle>
          </DialogHeader>
          <div className="">
            Are you sure you want to remove the package{" "}
            <code>{packageName}</code>?
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending} variant="destructive">
              {isPending && (
                <ReloadIcon className="mr-2 size-4 animate-spin" />
              )}
              Remove {packageName}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
