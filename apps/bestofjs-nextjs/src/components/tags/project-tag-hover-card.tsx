"use client";

import useSWR, { SWRConfiguration } from "swr";
import { Skeleton } from "../ui/skeleton";

import { TagIcon } from "../core";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";

export const ProjectTagHoverCard = ({
  children,
  tag,
}: {
  children: React.ReactNode;
  tag: BestOfJS.Tag;
}) => {
  const options: SWRConfiguration = {
    revalidateIfStale: false,
    revalidateOnFocus: false,
  };

  function fetchData() {
    const url = `/api/tags/${tag.code}`;
    return fetch(url).then((res) => res.json());
  }

  const { data, error } = useSWR(tag.code, fetchData, options);

  return (
    <HoverCard>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between space-x-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-1">
              <div style={{ color: "#F59E0B" }}>
                <TagIcon />
              </div>
              <h4 className="text-sm font-semibold">{tag.name}</h4>
            </div>
            <p className="text-sm ">{tag.description}</p>
            <div className="flex-row gap-y-3">
              <Skeleton className="h-[20px] w-[100%] p-4"></Skeleton>
              <Skeleton className="h-[20px] w-[100%] p-4"></Skeleton>
              <Skeleton className="h-[20px] w-[100%] p-4"></Skeleton>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
