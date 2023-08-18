import { Metadata } from "next";
import Image from "next/image";

import {
  ADD_PROJECT_REQUEST_URL,
  APP_DISPLAY_NAME,
  APP_REPO_URL,
  SPONSOR_URL,
} from "@/config/site";
import { Card } from "@/components/ui/card";
import { ExternalLink, PageHeading } from "@/components/core/typography";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  const count = 2000; // TODO fetch the total number of projects
  return (
    <>
      <PageHeading title="About Best of JS" />
      <Card className="space-y-4 p-4 font-serif">
        <div>
          <h2 className="text-xl">Why {APP_DISPLAY_NAME}?</h2>
          <p className="mt-2">
            Javascript, HTML and CSS are advancing faster than ever, we are
            going full speed on innovation.
            <br />
            Amazing open-source projects are released almost everyday.
          </p>
          <ul className="mt-2">
            <li>How to stay up-to-date about the latest tendencies?</li>
            <li>
              How to check quickly the projects that really matter,{" "}
              <strong>now</strong> and not 6 months ago?
            </li>
          </ul>
          <p className="mt-2">
            {APP_DISPLAY_NAME} was created in 2015 to address these questions.
          </p>
        </div>

        <div>
          <h2 className="text-xl">Concept</h2>
          <p className="mt-2">
            Checking the number of stars on GitHub is a good way to check
            project popularity but it does not tell you when the stars have been
            added.{" "}
          </p>
          <p className="mt-2">
            {APP_DISPLAY_NAME} takes &quot;snapshot&quot; of GitHub stars every
            day, for a curated list of {count} projects, to detect the trends
            over the last months.
          </p>
        </div>

        <div>
          <h2 className="text-xl">How it works</h2>
          <p className="mt-2">
            First, a list of projects related to the web platform and Node.js
            (JavaScript, Typescript, but also HTML and CSS) is stored in our
            database.
          </p>
          <p className="mt-2">
            Every time we find a new interesting project, we add it to the
            database.
          </p>
          <p className="mt-2">
            Then everyday, an automatic task checks project data from GitHub,
            for every project stored and generates data consumed by the web
            application.
          </p>
          <p className="mt-2">
            The web application displays the total number of stars and their
            variation over the last days.
          </p>
        </div>

        <div>
          <h2 className="text-xl">Do you want more projects?</h2>
          <p className="mt-2">
            Rather than scanning all existing projects on GitHub, we focus on a
            curated list of projects we find &quot;interesting&quot;, based on
            our experience and on things we read on the internet.
          </p>
          <p className="mt-2">
            As a result, some great projects must be missing!
          </p>
          <p className="mt-2">
            <ExternalLink url={ADD_PROJECT_REQUEST_URL}>
              Create a GitHub issue here
            </ExternalLink>{" "}
            to suggest a new project to add.
          </p>
        </div>

        <div>
          <h2 className="text-xl">Show your support!</h2>
          <p className="mt-2">
            If you find the application useful, you can star the repository on{" "}
            <ExternalLink url={APP_REPO_URL}>GitHub</ExternalLink> or{" "}
            <ExternalLink url={SPONSOR_URL}>become a sponsor</ExternalLink>.
          </p>
          <p className="mt-2">
            Thank you for your support, we are all made of stars{" "}
            <Image
              className="inline"
              src="/images/star.png"
              width={16}
              height={16}
              alt="star"
            />{" "}
            !
          </p>
        </div>
      </Card>
    </>
  );
}
