import { PropsWithChildren } from "react";

import { ExternalLink, PageHeading } from "@/components/core/typography";
import { APP_REPO_URL } from "@/config/site";

export default function HallOfFameLayout({ children }: PropsWithChildren) {
  return (
    <div className="space-y-6">
      <PageHeading
        title={<>JavaScript Hall of Fame</>}
        subtitle={
          <>
            Here are some of the greatest developers, authors and speakers of
            the JavaScript community.
            <br />
            They are sorted by number of followers,{" "}
            <ExternalLink
              url={APP_REPO_URL}
              className="color-primary underline hover:no-underline"
            >
              contact us
            </ExternalLink>{" "}
            to add more members!
          </>
        }
      />
      {children}
    </div>
  );
}
