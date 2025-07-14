import Link from "next/link";

import type { ProjectSearchUrlBuilder } from "@/app/projects/project-search-state";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ChevronDownIcon } from "../core";
import {
  type SortOptionKey,
  sortOrderOptionsByKey,
} from "./sort-order-options";

const sortOptionGroups: SortOptionKey[][] = [
  ["total"],
  ["daily", "weekly", "monthly", "yearly"],
  ["monthly-downloads"],
  ["last-commit", "contributors"],
  ["created", "newest"],
  // ["bookmark"],
];

type Props = {
  value: SortOptionKey;
  buildPageURL: ProjectSearchUrlBuilder;
};
export function ProjectSortOrderPicker({ value, buildPageURL }: Props) {
  const currentOption = sortOrderOptionsByKey[value];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          Sort: {currentOption?.label || ""}
          <ChevronDownIcon size={24} aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[300px] divide-y">
        {sortOptionGroups.map((group, index) => {
          return (
            <DropdownMenuGroup key={index} className="py-2">
              {group.map((id) => {
                const item = sortOrderOptionsByKey[id];
                const url = buildPageURL((state) => ({
                  ...state,
                  sort: item.key,
                  page: 1,
                }));

                return (
                  <DropdownMenuItem key={id} asChild>
                    <Link href={url}>{item.label}</Link>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuGroup>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
