"use client";

import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import { CreateProjectDialog } from "@/components/create-project.dialog";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal";

export function ActionBar() {
  const modal = useModal();
  const router = useRouter();
  return (
    <div>
      <Button
        onClick={async () => {
          const slug = await modal.show<string>((close) => (
            <CreateProjectDialog close={close} />
          ));
          if (slug) {
            router.push(`/projects/${slug}`);
          }
        }}
      >
        <PlusIcon />
        Add Project
      </Button>
    </div>
  );
}
