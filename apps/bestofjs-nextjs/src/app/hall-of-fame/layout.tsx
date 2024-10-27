import { PropsWithChildren } from "react";
import { Metadata } from "next";

import { ExternalLink, PageHeading } from "@/components/core/typography";
import {
  APP_CANONICAL_URL,
  APP_DISPLAY_NAME,
  APP_REPO_URL,
} from "@/config/site";

const description =
  "Some of the greatest developers, authors and speakers of the JavaScript community. Meet Evan, Dan, Sindre, TJ and friends!";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Hall of Fame",
    description,
    openGraph: {
      images: [`/api/og/hall-of-fame`],
      url: APP_CANONICAL_URL + "/hall-of-fame",
      title: APP_DISPLAY_NAME,
      description,
    },
  };
}

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
            <ExternalLink
              url={APP_REPO_URL}
              className="color-primary underline hover:no-underline"
            >
              Contact us
            </ExternalLink>{" "}
            to add more members!
          </>
        }
      />
      {children}
    </div>
  );
}
