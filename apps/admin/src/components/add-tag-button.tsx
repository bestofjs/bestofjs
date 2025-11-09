"use client";

import { useRouter } from "next/navigation";

import { AddTagDialog } from "@/components/add-tag.dialog";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal";

export function AddTagButton() {
  const { showModal } = useModal();
  const router = useRouter();

  return (
    <Button
      variant="default"
      onClick={async () => {
        const code = await showModal<string>((close) => (
          <AddTagDialog close={close} />
        ));
        if (code) {
          router.push(`/tags/${code}`);
        }
      }}
    >
      Add Tag
    </Button>
  );
}
