import Link from "next/link";

import {
  tagListSortOptions,
  TagSearchState,
  TagSearchUrlBuilder,
} from "@/app/tags/tag-search-state";
import { ChevronDownIcon } from "@/components/core";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Props = {
  value: TagSearchState["sort"];
  buildPageURL: TagSearchUrlBuilder;
};
export const TagSortOrderPicker = ({ value, buildPageURL }: Props) => {
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
            const url = buildPageURL((state) => ({
              ...state,
              sort: value,
              page: 1,
            }));

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
