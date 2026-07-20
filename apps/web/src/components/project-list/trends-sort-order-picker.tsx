import Link from "next/link";

import type { TrendsSortKey } from "@repo/db/shared-schemas";

import type { TrendsProjectSearchUrlBuilder } from "@/app/projects/trends-project-search-state";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ChevronDownIcon } from "../core";
import { trendsSortOrderOptionsByKey } from "./trends-sort-order-options";

const sortOptionGroups: TrendsSortKey[][] = [
  ["most-stars"],
  ["daily", "weekly", "monthly", "yearly"],
  ["trending"],
  ["most-active"],
  ["most-used"],
  ["newest"],
];

type Props = {
  value: TrendsSortKey;
  buildPageURL: TrendsProjectSearchUrlBuilder;
};
export function TrendsProjectSortOrderPicker({ value, buildPageURL }: Props) {
  const currentOption = trendsSortOrderOptionsByKey[value];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          Sort: {currentOption?.label || ""}
          <ChevronDownIcon className="size-6" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[300px] divide-y">
        {sortOptionGroups.map((group, index) => {
          return (
            <DropdownMenuGroup key={index} className="py-2">
              {group.map((key) => {
                const item = trendsSortOrderOptionsByKey[key];
                const url = buildPageURL((state) => ({
                  ...state,
                  sort: item.key,
                  page: 1,
                }));

                return (
                  <DropdownMenuItem key={key} asChild>
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
