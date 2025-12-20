"use client";

import { InfoIcon } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { SearchIcon, XMarkIcon } from "@/components/core";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function HallOfFameSearchBar() {
  const searchParams = useSearchParams();
  return (
    <form className="flex w-full gap-4" action="/hall-of-fame/search">
      <Input
        key={searchParams?.get("query")}
        autoFocus
        autoComplete="off"
        autoCorrect="false"
        spellCheck="false"
        type="text"
        placeholder="Filter by name or username"
        name="query"
        defaultValue={searchParams?.get("query") || ""}
      />
      <Link
        href="/hall-of-fame"
        className={buttonVariants({ variant: "outline" })}
      >
        <span className="mr-2 hidden md:inline">Reset</span>
        <XMarkIcon className="size-5" />
      </Link>
      <Button type="submit">
        <span className="mr-2 hidden md:inline">Search</span>
        <SearchIcon className="size-5" />
      </Button>
    </form>
  );
}

export function DescribeSearchResults({ count }: { count: number }) {
  if (count === 0) {
    return (
      <Alert className="mt-8">
        <InfoIcon className="size-5" />
        <AlertTitle>No results found</AlertTitle>
        <AlertDescription>
          Try another search or click on the Reset button.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <InfoIcon className="size-5" />
      <span>Search results:</span>
      {count === 1 ? "One member found" : `${count} members found`}
    </div>
  );
}
