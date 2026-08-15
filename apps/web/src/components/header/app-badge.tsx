import { Badge } from "@/components/ui/badge";
import { appBadgeLabel } from "@/config/apps";

/**
 * Renders nothing on the main deployment, where `appBadgeLabel` is `null` — the
 * one piece of UI that differs between deployments, and it differs by data
 * rather than by a branch on the app's identity.
 */
export function AppBadge() {
  if (!appBadgeLabel) return null;

  return (
    <Badge variant="secondary" className="uppercase">
      {appBadgeLabel}
    </Badge>
  );
}
