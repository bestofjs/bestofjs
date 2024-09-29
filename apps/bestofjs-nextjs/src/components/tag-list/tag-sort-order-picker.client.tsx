"use client";

import Link from "next/link";

import {
  tagListSortOptions,
  TagSearchState,
  tagSearchStateToQueryString,
} from "@/app/tags/tag-search-types";
import { ChevronDownIcon } from "../core";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

type Props = {
  value: TagSearchState["sort"];
  searchState: TagSearchState;
};
export const TagSortOrderPicker = ({ value, searchState }: Props) => {
  const currentOption = tagListSortOptions.find(
    (option) => option.value === value
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          Sort: {currentOption?.text || ""}
          <ChevronDownIcon size={24} aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[300px] divide-y" align="start">
        <DropdownMenuGroup>
          {tagListSortOptions.map(({ value, text }) => {
            const nextState: TagSearchState = {
              ...searchState,
              page: 1,
              sort: value,
            };
            const queryString = tagSearchStateToQueryString(nextState);
            const url = `/tags?` + queryString;

            return (
              <DropdownMenuItem key={value} asChild>
                <Link href={url}>{text}</Link>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
