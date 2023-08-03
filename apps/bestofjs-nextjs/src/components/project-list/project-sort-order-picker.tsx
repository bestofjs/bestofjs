import Link from "next/link";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { stateToQueryString } from "./navigation-state";
import { SortOptionKey, sortOrderOptionsByKey } from "./sort-order-options";

const sortOptionGroups: SortOptionKey[][] = [
  ["total"],
  ["daily", "weekly", "monthly", "yearly"],
  ["monthly-downloads"],
  ["last-commit", "contributors"],
  ["created", "newest"],
  // ["bookmark"],
];

type Props = { value: SortOptionKey; searchState: any };
export function ProjectSortOrderPicker({ value, searchState }: Props) {
  const currentOption = sortOrderOptionsByKey[value];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          Sort: {currentOption?.label || ""}
          <ChevronDownIcon className="h-6 w-6" aria-hidden="true" />
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
                const url = `/projects?` + queryString;

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
