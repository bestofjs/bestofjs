"use client";

import { useState } from "react";
import useSWR, { SWRConfiguration } from "swr";

import { TagIcon } from "../core";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { Skeleton } from "../ui/skeleton";

export const ProjectTagHoverCard = ({
  children,
  tag,
}: {
  children: React.ReactNode;
  tag: BestOfJS.Tag;
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onOpenChange = (e) => {
    setIsOpen(e)
  };

  return (
    <HoverCard onOpenChange={onOpenChange}>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent>
        <TagCardContent isOpen ={isOpen}/>
      </HoverCardContent>
    </HoverCard>
  );
};



const CardTagProjects = ({ isOpen }) => {
  if (isOpen === true) {
    console.log('it is open!', isOpen)

  }
};

const TagCardContent = ({ isOpen }) => <CardTagProjects isOpen={isOpen} />;

//TODO continue with component composition https://blog.logrocket.com/solving-prop-drilling-react-apps/

// const options: SWRConfiguration = {
//   revalidateIfStale: false,
//   revalidateOnFocus: false,
// };

// function fetchData() {
//   const url = `/api/tags/${tag.code}`;
//   return fetch(url).then((res) => res.json());
// }

// const { data, error } = useSWR(tag.code, fetchData, options);
