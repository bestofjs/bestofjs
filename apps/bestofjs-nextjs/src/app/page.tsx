import NextLink from "next/link";
import { fromNow } from "@/helpers/from-now";
import { formatNumberFull } from "@/helpers/numbers";
import { GoFlame, GoGift, GoHeart, GoPlus } from "react-icons/go";

import {
  ADD_PROJECT_REQUEST_URL,
  APP_DISPLAY_NAME,
  APP_REPO_FULL_NAME,
  APP_REPO_URL,
  SPONSOR_URL,
} from "@/config/site";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CardHeader, StarIcon, TagIcon } from "@/components/core";
import { SectionHeading } from "@/components/core/section";
import { ExternalLink } from "@/components/core/typography";
import { FeaturedProjects } from "@/components/home/home-featured-projects";
import { LatestMonthlyRankings } from "@/components/home/latest-monthly-rankings";
import {
  ProjectScore,
  ProjectTable,
} from "@/components/project-list/project-table";
import { CompactTagList } from "@/components/tag-list/compact-tag-list";

import { searchClient } from "./backend";
import {
  getHotProjectsRequest,
  getLatestProjects,
} from "./backend-search-requests";

export default async function IndexPage() {
  const {
    hotProjects,
    newestProjects,
    bestOfJSProject,
    popularTags,
    lastUpdateDate,
    total,
  } = await getData();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-start gap-2">
        <h1 className="font-serif text-3xl leading-tight tracking-tighter md:text-4xl">
          The best of JS, HTML and CSS
        </h1>
        <p className="font-serif text-lg text-muted-foreground">
          A place to find the best open source projects related to the web
          platform:
          <br />
          JS, HTML, CSS, but also TypeScript, Node.js, Deno, Bun...
        </p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="flex-1 space-y-8">
          <HotProjectList projects={hotProjects} />

          <NewestProjectList projects={newestProjects} />
        </div>
        <div className="space-y-8 lg:w-[300px]">
          {/* @ts-expect-error Server Component */}
          <FeaturedProjects />
          <PopularTagsList tags={popularTags} />
        </div>
      </div>

      {/* @ts-expect-error Server Component */}
      <LatestMonthlyRankings />

      <Separator className="-mx-4 w-auto sm:mx-0" />

      <BestOfJSSection project={bestOfJSProject} />

      <Separator className="-mx-4 w-auto sm:mx-0" />

      <MoreProjectsSection lastUpdateDate={lastUpdateDate} total={total} />
    </div>
  );
}

function HotProjectList({ projects }: { projects: BestOfJS.Project[] }) {
  return (
    <Card>
      <CardHeader>
        <SectionHeading
          icon={<GoFlame fontSize={32} />}
          title="Hot Projects"
          subtitle={
            <>
              By number of stars added <b>the last 24 hours</b>
            </>
          }
        />
      </CardHeader>
      <ProjectTable
        projects={projects}
        showDetails={false}
        metricsCell={(project) => (
          <ProjectScore project={project} sortOptionId="daily" />
        )}
        footer={
          <NextLink
            href={`/projects?sort=daily`}
            passHref
            className={cn(
              buttonVariants({ variant: "link" }),
              "text-md w-full text-secondary-foreground"
            )}
          >
            View full rankings »
          </NextLink>
        }
      />
    </Card>
  );
}

function NewestProjectList({ projects }: { projects: BestOfJS.Project[] }) {
  return (
    <Card>
      <CardHeader>
        <SectionHeading
          icon={<GoGift fontSize={32} />}
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
          <ProjectScore project={project} sortOptionId="total" />
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

function PopularTagsList({ tags }: { tags: BestOfJS.Tag[] }) {
  return (
    <Card>
      <CardHeader>
        <SectionHeading
          icon={<TagIcon fontSize={32} />}
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

function BestOfJSSection({ project }: { project: BestOfJS.Project | null }) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:px-4 md:flex-row">
      <div>
        <SectionHeading
          className="mb-4"
          icon={<GoHeart fontSize={32} />}
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
              {formatNumberFull(project.stars)} <StarIcon size={24} />
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
            <GoHeart size={20} />
          </span>
        </a>
      </div>
    </div>
  );
}

function MoreProjectsSection({
  lastUpdateDate,
  total,
}: {
  lastUpdateDate: Date;
  total: number;
}) {
  const timeOnlyFormat = new Intl.DateTimeFormat("default", {
    hour: "numeric",
    minute: "numeric",
  });

  return (
    <div className="sm:px-4">
      <SectionHeading
        className="mb-4"
        icon={<GoPlus fontSize={32} />}
        title="Do you want more projects?"
      />
      <div className="space-y-4 pl-10 font-serif">
        <p>
          {APP_DISPLAY_NAME} is a curated list of {formatNumberFull(total)}{" "}
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
          Data is updated from GitHub everyday, the last update was{" "}
          <b>{fromNow(lastUpdateDate)}</b> (at{" "}
          {timeOnlyFormat.format(lastUpdateDate)}
          ).
        </p>
      </div>
    </div>
  );
}

async function getData() {
  const {
    projects: hotProjects,
    lastUpdateDate,
    total,
  } = await searchClient.findProjects(getHotProjectsRequest());
  const { projects: newestProjects } = await searchClient.findProjects(
    getLatestProjects()
  );
  const bestOfJSProject = await searchClient.findOne({
    full_name: APP_REPO_FULL_NAME,
  });
  const { tags: popularTags } = await searchClient.findTags({
    sort: { counter: -1 },
    limit: 10,
  });
  return {
    bestOfJSProject,
    hotProjects,
    lastUpdateDate,
    newestProjects,
    popularTags,
    total,
  };
}
