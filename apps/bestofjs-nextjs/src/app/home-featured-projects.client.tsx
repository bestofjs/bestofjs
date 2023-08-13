"use client";

import { useEffect, useState } from "react";
import useSWR, { useSWRConfig } from "swr";

import { Button } from "@/components/ui/button";
import {
  CardHeader,
  ChevronLeftIcon,
  ChevronRightIcon,
  StarIcon,
} from "@/components/core";
import { SectionHeading } from "@/components/core/section";
import {
  FeaturedProjectList,
  ProjectListSkeleton,
} from "@/components/home/featured-project-list";

const numberOfProjectPerPage = 5;
const totalNumberOfProjects = 200; // TODO get the value from the API
const lastPageNumber = totalNumberOfProjects / numberOfProjectPerPage - 1;
const forceLoadingState = false; // for debugging

type Props = { initialContent: React.ReactNode };
export function FeaturedProjectsClient({ initialContent }: Props) {
  const [pageNumber, setPageNumber] = useState<number>(0);
  const increment = () => {
    setPageNumber((state) => state + 1);
  };
  const decrement = () => {
    setPageNumber((state) => state - 1);
  };

  return (
    <>
      <CardHeader>
        <SectionHeading
          icon={<StarIcon fontSize={32} />}
          title="Featured"
          subtitle={
            <>
              <div className="flex items-center justify-between pt-0">
                <div>Random order</div>
                <div className="flex items-center">
                  <Button
                    onClick={decrement}
                    variant="ghost"
                    size="icon"
                    className="h-6 w-10"
                    disabled={pageNumber === 0}
                  >
                    <ChevronLeftIcon size={24} />
                  </Button>
                  <Button
                    onClick={increment}
                    variant="ghost"
                    size="icon"
                    className="h-6 w-10"
                    disabled={pageNumber === lastPageNumber}
                  >
                    <ChevronRightIcon size={24} />
                  </Button>
                </div>
              </div>
            </>
          }
        />
      </CardHeader>
      {/* Initially we render the content generated server-side by the RSC */}
      {pageNumber === 0 ? (
        <>{initialContent}</>
      ) : (
        <DynamicFeaturedProjectList pageNumber={pageNumber} />
      )}
    </>
  );
}

function DynamicFeaturedProjectList({ pageNumber }: { pageNumber: number }) {
  const {
    data: projects,
    isValidating,
    error,
  } = useSWR(`random-projects`, () => fetchRandomProjects(pageNumber), {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  const { mutate } = useSWRConfig();
  useEffect(() => {
    if (pageNumber > 1) {
      mutate("random-projects");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber]);

  if (error) {
    return <>Error when loading Featured projects</>;
  }

  if (forceLoadingState || isValidating) {
    return <ProjectListSkeleton numberOfItems={numberOfProjectPerPage} />;
  }

  return <FeaturedProjectList projects={projects as BestOfJS.Project[]} />;
}

async function fetchRandomProjects(pageNumber: number) {
  const params = new URLSearchParams();
  params.set("offset", (pageNumber * numberOfProjectPerPage).toString());
  const url = "/api/featured-projects?" + params.toString();
  const data = await fetch(url).then((res) => res.json());
  return data.projects as BestOfJS.Project[];
}
