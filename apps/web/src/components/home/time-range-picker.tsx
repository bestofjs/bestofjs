"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { ChevronDownIcon } from "@/components/core";
import {
  getSortOptionByKey,
  type SortOptionKey,
} from "@/components/project-list/sort-order-options";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";

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
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleOpenChange = (open: boolean) => {
    if (open) {
      // Prefetch RSC payloads for all trend routes when dropdown opens
      router.prefetch("/");
      router.prefetch("/trends/weekly");
      router.prefetch("/trends/monthly");
      router.prefetch("/trends/yearly");
    }
    setIsOpen(open);
  };

  const handleNavigate = (path: string) => {
    startTransition(() => {
      router.push(path);
    });
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={isPending}>
          {isPending ? (
            <>
              <Spinner /> Loading...
            </>
          ) : (
            <>
              {sortOption.shortLabel || sortOption.label}
              <ChevronDownIcon className="size-6" aria-hidden="true" />
            </>
          )}
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
                disabled={isPending}
                onCheckedChange={() => handleNavigate(nextPath)}
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
