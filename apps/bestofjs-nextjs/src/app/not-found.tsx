import Link from "next/link";

import { APP_REPO_URL } from "@/config/site";
import { ExternalLink, PageHeading } from "@/components/core/typography";

export default function NotFound() {
  return (
    <>
      <PageHeading title={"Not Found"} />
      <div className="space-y-4 font-serif">
        <p>Sorry, we cannot find this page!</p>
        <p>
          Please contact us on{" "}
          <ExternalLink url={APP_REPO_URL}>GitHub</ExternalLink> to mention this
          problem.
        </p>
        <p>
          Return to{" "}
          <Link href="/" className="text-primary hover:underline">
            Best of JS Home
          </Link>
        </p>
      </div>
    </>
  );
}
