"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import { AddProjectToRepoDialog } from "@/components/add-project-to-repo.dialog";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal";

export function AddProjectToRepoButton({ repoId }: { repoId: string }) {
  const { showModal } = useModal();
  const router = useRouter();

  return (
    <Button
      variant="default"
      onClick={async () => {
        const slug = await showModal<string>((close) => (
          <AddProjectToRepoDialog repoId={repoId} close={close} />
        ));
        if (slug) {
          router.push(`/projects/${slug}`);
        }
      }}
    >
      <Plus className="size-4" />
      Add Project
    </Button>
  );
}
