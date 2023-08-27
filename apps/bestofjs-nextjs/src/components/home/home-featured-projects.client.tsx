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

const forceLoadingState = false; // for debugging

type Props = {
  initialContent: React.ReactNode;
  numberOfProjectPerPage: number;
  totalNumberOfProjects: number;
};
export function FeaturedProjectsClient({
  initialContent,
  numberOfProjectPerPage,
  totalNumberOfProjects,
}: Props) {
  const [pageNumber, setPageNumber] = useState<number>(0);
  const setNextPageNumber = () => {
    setPageNumber((state) => state + 1);
  };
  const setPreviousPageNumber = () => {
    setPageNumber((state) => state - 1);
  };

  const lastPageNumber = Math.ceil(
    totalNumberOfProjects / numberOfProjectPerPage - 1
  );

  return (
    <>
      <CardHeader>
        <SectionHeading
          icon={<StarIcon fontSize={32} />}
          title="Featured"
          subtitle={
            <>
              <div className="flex items-center justify-between">
                <div>Random order</div>
                <div className="flex items-center">
                  <Button
                    aria-label="Previous"
                    onClick={setPreviousPageNumber}
                    variant="ghost"
                    size="icon"
                    className="h-6 w-10"
                    disabled={pageNumber === 0}
                  >
                    <ChevronLeftIcon size={24} />
                  </Button>
                  <Button
                    aria-label="Next"
                    onClick={setNextPageNumber}
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
        <DynamicFeaturedProjectList
          pageNumber={pageNumber}
          numberOfProjectPerPage={numberOfProjectPerPage}
        />
      )}
    </>
  );
}

function DynamicFeaturedProjectList({
  pageNumber,
  numberOfProjectPerPage,
}: {
  pageNumber: number;
  numberOfProjectPerPage: number;
}) {
  const {
    data: projects,
    isValidating,
    error,
  } = useSWR(
    `random-projects`,
    () => fetchRandomProjects(pageNumber, numberOfProjectPerPage),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  const { mutate } = useSWRConfig();
  useEffect(() => {
    if (pageNumber > 0) {
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

async function fetchRandomProjects(
  pageNumber: number,
  numberOfProjectPerPage: number
) {
  const params = new URLSearchParams();
  params.set("skip", (pageNumber * numberOfProjectPerPage).toString());
  params.set("limit", numberOfProjectPerPage.toString());
  const url = "/api/featured-projects?" + params.toString();
  const data = await fetch(url).then((res) => res.json());
  return data.projects as BestOfJS.Project[];
}
