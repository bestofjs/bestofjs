import { appBadgeLabel } from "@/config/apps";
import { cn } from "@/lib/utils";

/**
 * Renders nothing on the main deployment, where `appBadgeLabel` is `null` — the
 * one piece of UI that differs between deployments, and it differs by data
 * rather than by a branch on the app's identity.
 *
 * Positioned by its parent (`MainNavContent`), which hangs it off the top-right
 * corner of the logo like an edition mark. Neutral sand rather than the logo's
 * own orange: next to the letters, a matching fill reads as part of the
 * wordmark instead of as a label attached to it. Sand 3/11 keeps it a surface
 * sitting just off the page background rather than an inverted chip, which at
 * this size shouts louder than a permanent, unchanging marker should.
 */
export function AppBadge() {
  if (!appBadgeLabel) return null;

  return (
    <span
      className={cn(
        "-top-0.5 -right-8 -z-10 pointer-events-none absolute rounded-full",
        "border border-(--sand-6) bg-(--sand-3) px-1.5 py-px",
        "font-sans font-semibold text-(--sand-11) text-[10px] uppercase tracking-wide",
      )}
    >
      {appBadgeLabel}
    </span>
  );
}
