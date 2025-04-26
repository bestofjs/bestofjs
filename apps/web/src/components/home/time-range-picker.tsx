"use client";

import { useRouter } from "next/navigation";

import { ChevronDownIcon } from "@/components/core";
import {
  getSortOptionByKey,
  SortOptionKey,
} from "@/components/project-list/sort-order-options";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const sortOptionKeys: SortOptionKey[] = [
  "daily",
  "weekly",
  "monthly",
  "yearly",
];

type Props = {
  value: SortOptionKey;
};

export function TimeRangePicker({ value }: Props) {
  const sortOption = getSortOptionByKey(value);
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          {sortOption.shortLabel || sortOption.label}
          <ChevronDownIcon size={24} aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          {sortOptionKeys.map((sortOptionKey) => {
            const item = getSortOptionByKey(sortOptionKey);
            const nextPath =
              sortOptionKey === "daily" ? "/" : `/trends/${sortOptionKey}`;
            return (
              <DropdownMenuCheckboxItem
                key={sortOptionKey}
                checked={sortOptionKey === value}
                onCheckedChange={() => router.push(nextPath)}
              >
                {item.shortLabel || item.label}
              </DropdownMenuCheckboxItem>
            );
          })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
