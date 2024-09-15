import Link from "next/link";

import { ProjectSearchQuery } from "@/app/projects/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon } from "../core";
import { stateToQueryString } from "./navigation-state";
import { SortOptionKey, sortOrderOptionsByKey } from "./sort-order-options";

const timePeriodOptions: SortOptionKey[] = [
  "daily",
  "weekly",
  "monthly",
  "yearly",
];

const sortOptionGroups: SortOptionKey[][] = [
  ["total"],
  timePeriodOptions,
  ["monthly-downloads"],
  ["last-commit", "contributors"],
  ["created", "newest"],
  // ["bookmark"],
];

type Props = {
  value: SortOptionKey;
  searchState: ProjectSearchQuery;
  path?: string;
};

export function ProjectSortOrderPicker({
  value,
  searchState,
  path = "/projects",
}: Props) {
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
                const nextState = { ...searchState, page: 1, sort: item.key };
                const queryString = stateToQueryString(nextState);
                const url = path + `?` + queryString;

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

export function HotProjectSortOrderPicker({ value, searchState }: Props) {
  const currentOption = sortOrderOptionsByKey[value];
  const currentOptionLabel =
    currentOption?.hotProjectsLabel || currentOption?.label || "";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-40">
          {currentOptionLabel}
          <ChevronDownIcon size={24} aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[150px] divide-y">
        {timePeriodOptions.map((id) => {
          const item = sortOrderOptionsByKey[id];
          const nextState = { ...searchState, page: 1, sort: item.key };
          const queryString = stateToQueryString(nextState);
          const url = `?${queryString}`;

          return (
            <DropdownMenuItem key={id} asChild>
              <Link href={url} scroll={false}>
                {item.hotProjectsLabel || item.label}
              </Link>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
