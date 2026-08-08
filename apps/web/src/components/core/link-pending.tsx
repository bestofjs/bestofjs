"use client";

import type React from "react";
import { useLinkStatus } from "next/link";

import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

/**
 * Swaps a link's trailing icon for a spinner while its navigation is pending.
 *
 * Filter links point at the route segment already on screen
 * (`/projects?tags=a` → `?tags=b`), so React keeps the mounted list visible
 * through the transition and nothing else acknowledges the click.
 *
 * Must render inside a `<Link>`: `useLinkStatus()` reads that link's context
 * and returns `{ pending: false }` anywhere else.
 */
export function LinkPendingIcon({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { pending } = useLinkStatus();

  return (
    <span
      className={cn(
        "relative inline-flex size-5 items-center justify-center",
        className,
      )}
    >
      <span
        aria-hidden={pending}
        className={cn(
          "inline-flex transition-opacity",
          pending ? "opacity-0" : "opacity-100",
        )}
      >
        {children}
      </span>
      <Spinner
        aria-hidden={!pending}
        className={cn(
          "absolute size-4 transition-opacity",
          // The delay applies to the fade in only, so a navigation that
          // resolves in under 150ms never flashes a spinner.
          pending ? "opacity-100 delay-150" : "opacity-0",
        )}
      />
    </span>
  );
}

/**
 * Same feedback for links with no icon to swap: a spinner fades in over the
 * link's own content, so the chip never changes size.
 *
 * The parent `<Link>` needs `relative`, and `bg-inherit` keeps the overlay on
 * the chip's current background, hover included.
 */
export function LinkPendingOverlay() {
  const { pending } = useLinkStatus();

  return (
    <span
      aria-hidden={!pending}
      className={cn(
        "pointer-events-none absolute inset-0 flex items-center justify-center rounded-[inherit] bg-inherit transition-opacity",
        pending ? "opacity-100 delay-150" : "opacity-0",
      )}
    >
      <Spinner className="size-3.5" />
    </span>
  );
}
