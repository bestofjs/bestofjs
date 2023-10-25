"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { SearchIcon } from "../core";
import { useIsApplePlatform } from "./use-is-apple-platform";

type Props = {
  onClick: () => void;
};
export function SearchTrigger({ onClick }: Props) {
  const isApplePlatform = useIsApplePlatform();

  return (
    <>
      <Button
        variant="outline"
        className={cn(
          "relative ml-4 hidden h-9 w-full justify-start rounded-[0.5rem] text-sm text-muted-foreground sm:pr-12 md:w-40 lg:inline-flex lg:w-64"
        )}
        onClick={onClick}
      >
        <span className="hidden lg:inline-flex">Search in projects...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 text-[10px] font-medium opacity-100 sm:flex">
          {isApplePlatform ? (
            <>
              <span className="text-xs">⌘</span>K
            </>
          ) : (
            <>Ctrl K</>
          )}
        </kbd>
      </Button>
      <div className="flex items-center gap-4 lg:hidden">
        <Button onClick={onClick} size="sm" variant="ghost" aria-label="Search">
          <SearchIcon />
        </Button>
        <Separator orientation="vertical" className="h-6" />
      </div>
    </>
  );
}
