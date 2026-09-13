"use client";

import { InfoIcon } from "lucide-react";

import { linkVariants } from "@/components/ui/link";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
/**
 * A popover rather than a tooltip: a tooltip never opens on touch devices, and
 * this is the only pointer to the No AI deployment a first-time visitor gets.
 * The trigger is a real button so it is reachable by keyboard too.
 *
 * The pointer lives behind an icon instead of an extra sentence because the
 * intro paragraph has a hard two-line budget on desktop — a third line costs
 * more above-the-fold space than the link is worth.
 *
 * The host arrives as a prop rather than being read from `@/config/apps`: that
 * module derives `currentApp` from a server-only env var at import time, so a
 * client component pulling *any* symbol out of it crashes the browser bundle.
 */
export function AiToolingInfo({ host }: { host: string }) {
  return (
    <Popover>
      <PopoverTrigger
        aria-label="About AI projects on Best of JS"
        className="ml-1 inline-flex align-middle text-muted-foreground hover:text-foreground"
      >
        <InfoIcon className="size-4" />
      </PopoverTrigger>
      <PopoverContent align="start" className="font-sans text-sm">
        Prefer a version without AI projects? Visit{" "}
        <a href={`https://${host}`} className={linkVariants()}>
          {host}
        </a>
        .
      </PopoverContent>
    </Popover>
  );
}
