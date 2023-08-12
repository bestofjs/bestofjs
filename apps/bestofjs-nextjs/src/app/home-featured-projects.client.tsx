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
import { FeaturedProjectList } from "@/components/home/featured-project-list";

const numberOfProjectPerPage = 5;
const totalNumberOfProjects = 200; // TODO get the value from the API
const lastPageNumber = totalNumberOfProjects / numberOfProjectPerPage - 1;

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
                <Button
                  onClick={decrement}
                  variant="outline"
                  size="icon"
                  className="h-5 w-8"
                  disabled={pageNumber === 0}
                >
                  <ChevronLeftIcon size={16} />
                </Button>
                <div>Random order</div>
                <Button
                  onClick={increment}
                  variant="outline"
                  size="icon"
                  className="h-5 w-8"
                  disabled={pageNumber === lastPageNumber}
                >
                  <ChevronRightIcon size={16} />
                </Button>
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
    isLoading,
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
  if (isLoading) return <>Loading</>;
  if (error) return <>Error!</>;
  return <FeaturedProjectList projects={projects as BestOfJS.Project[]} />;
}

async function fetchRandomProjects(pageNumber: number) {
  const params = new URLSearchParams();
  params.set("offset", (pageNumber * numberOfProjectPerPage).toString());
  const url = "/api/featured-projects?" + params.toString();
  const data = await fetch(url).then((res) => res.json());
  return data.projects as BestOfJS.Project[];
}
