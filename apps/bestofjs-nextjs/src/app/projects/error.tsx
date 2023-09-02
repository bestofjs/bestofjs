"use client";

// Error components must be Client Components
import { useEffect } from "react";

import { APP_REPO_URL, DISCORD_URL } from "@/config/site";
import { ExternalLink, PageHeading } from "@/components/core/typography";

export default function Error({ error }: { error: Error; reset: () => void }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div>
      <PageHeading title="Error" />
      <div className="space-y-4">
        <p>Sorry, something went wrong!</p>
        <p>
          Please contact us on{" "}
          <ExternalLink url={APP_REPO_URL}>GitHub</ExternalLink> or{" "}
          <ExternalLink url={DISCORD_URL}>Discord</ExternalLink>, thank you for
          your help!
        </p>
      </div>
    </div>
  );
}
