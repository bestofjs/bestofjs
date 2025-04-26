import NextLink from "next/link";
import { GiftIcon, HeartIcon, PlusIcon } from "lucide-react";

import { StarIcon, TagIcon } from "@/components/core";
import { SectionHeading } from "@/components/core/section";
import { ExternalLink } from "@/components/core/typography";
import {
  ProjectScore,
  ProjectTable,
} from "@/components/project-list/project-table";
import { CompactTagList } from "@/components/tag-list/compact-tag-list";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import {
  ADD_PROJECT_REQUEST_URL,
  APP_DISPLAY_NAME,
  APP_REPO_URL,
  SPONSOR_URL,
} from "@/config/site";
import { formatNumber } from "@/helpers/numbers";
import { cn } from "@/lib/utils";

export function NewestProjectList({
  projects,
}: {
  projects: BestOfJS.Project[];
}) {
  return (
    <Card>
      <CardHeader>
        <SectionHeading
          icon={<GiftIcon className="size-8" />}
          title="Recently Added Projects"
          subtitle={
            <>
              Latest additions to <i>Best of JS</i>
            </>
          }
        />
      </CardHeader>
      <ProjectTable
        projects={projects}
        showDetails={false}
        metricsCell={(project) => (
          <ProjectScore project={project} sort="total" />
        )}
        footer={
          <NextLink
            href={`/projects?sort=newest`}
            passHref
            className={cn(
              buttonVariants({ variant: "link" }),
              "text-md w-full text-secondary-foreground"
            )}
          >
            View more »
          </NextLink>
        }
      />
    </Card>
  );
}

export function PopularTagsList({ tags }: { tags: BestOfJS.Tag[] }) {
  return (
    <Card>
      <CardHeader>
        <SectionHeading
          icon={<TagIcon className="size-8" />}
          title="Popular Tags"
          subtitle={<>By number of projects</>}
        />
      </CardHeader>
      <CompactTagList tags={tags} />
      <div className="border-t p-4">
        <NextLink
          href={`/tags`}
          passHref
          className={cn(
            buttonVariants({ variant: "link" }),
            "text-md w-full text-secondary-foreground"
          )}
        >
          View all tags »
        </NextLink>
      </div>
    </Card>
  );
}

export function BestOfJSSection({
  project,
}: {
  project: BestOfJS.Project | null;
}) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:px-4 md:flex-row">
      <div>
        <SectionHeading
          className="mb-4"
          icon={<HeartIcon className="size-8" />}
          title={<>Do you find {APP_DISPLAY_NAME} useful?</>}
        />
        <div className="pl-10 font-serif">
          <p>
            Show your appreciation by starring the project on{" "}
            <ExternalLink url={APP_REPO_URL}>GitHub</ExternalLink>, or becoming
            a <ExternalLink url={SPONSOR_URL}>sponsor</ExternalLink>.
          </p>
          <p>Thank you for your support!</p>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {project && (
          <a
            href={APP_REPO_URL}
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "text-md min-w-[260px]"
            )}
          >
            Star on GitHub
            <span className="align-center ml-4 inline-flex">
              {formatNumber(project.stars, "full")} <StarIcon size={24} />
            </span>
          </a>
        )}
        <a
          href={SPONSOR_URL}
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "text-md"
          )}
        >
          Sponsor
          <span className="align-center ml-4 inline-flex">
            <HeartIcon className="size-5" />
          </span>
        </a>
      </div>
    </div>
  );
}

export function MoreProjectsSection({
  lastUpdateDate,
  total,
}: {
  lastUpdateDate: Date;
  total: number;
}) {
  function formatDateGMT(date: Date) {
    return date.toJSON().slice(0, 10) + " " + date.toJSON().slice(11, 16);
  }

  return (
    <div className="sm:px-4">
      <SectionHeading
        className="mb-4"
        icon={<PlusIcon className="size-8" />}
        title="Do you want more projects?"
      />
      <div className="space-y-4 pl-10 font-serif">
        <p>
          {APP_DISPLAY_NAME} is a curated list of {formatNumber(total, "full")}{" "}
          open-source projects related to the web platform and Node.js.
          <br />
          If you want to suggest a new project, please click on the following
          link:{" "}
          <ExternalLink url={ADD_PROJECT_REQUEST_URL}>
            recommend a new project
          </ExternalLink>
          .
        </p>
        <p>
          Data is updated from GitHub every 24 hours, the last update was at{" "}
          <code className="relative mr-2 rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
            {formatDateGMT(lastUpdateDate)}
          </code>
          (GMT).
        </p>
      </div>
    </div>
  );
}
