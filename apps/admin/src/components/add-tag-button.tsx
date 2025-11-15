"use client";

import { useRouter } from "next/navigation";

import { AddTagDialog } from "@/components/add-tag.dialog";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal";

export function AddTagButton() {
  const modal = useModal();
  const router = useRouter();

  return (
    <Button
      variant="default"
      onClick={async () => {
        const code = await modal.show<string>((close) => (
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
