"use client";

import { useState } from "react";
import { InfoIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { searchHallOfFameMembers } from "./actions";
import { HallOfFameSearchBar } from "./hall-of-fame-search.client";
import { HallOfFameMemberList } from "./hall-of-member-list";
import { HallOfFameSkeletonCard } from "./loading";

export function HallOfFameClientView({
  initialContent,
}: {
  initialContent: React.ReactNode;
}) {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<BestOfJS.HallOfFameMember[]>([]);
  const [isPending, setIsPending] = useState(false);

  const onSearch = async (searchQuery: string) => {
    setQuery(searchQuery);
    setIsPending(true);
    const members = await searchHallOfFameMembers(searchQuery);
    setIsPending(false);
    setResults(members);
  };

  const onReset = () => {
    setQuery("");
  };

  return (
    <>
      <HallOfFameSearchBar
        query={query}
        onSubmit={onSearch}
        onReset={onReset}
      />
      {query ? (
        <SearchResults results={results} isPending={isPending} />
      ) : (
        initialContent
      )}
    </>
  );
}

function SearchResults({
  results,
  isPending,
}: {
  results: BestOfJS.HallOfFameMember[];
  isPending: boolean;
}) {
  if (isPending) {
    return (
      <>
        <div className="mb-4 text-muted-foreground">Searching...</div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {["?", "?"].map((name, index) => (
            <HallOfFameSkeletonCard key={index} name={name} />
          ))}
        </div>
      </>
    );
  }
  return (
    <>
      <div className="mb-4 text-muted-foreground">
        <DescribeSearchResults count={results.length} />
      </div>
      <HallOfFameMemberList members={results} />
    </>
  );
}

function DescribeSearchResults({ count }: { count: number }) {
  if (count === 0) {
    return (
      <Alert className="mt-8">
        <InfoIcon className="h-5 w-5" />
        <AlertTitle>No results found</AlertTitle>
        <AlertDescription>
          Try another search or click on the Reset button.
        </AlertDescription>
      </Alert>
    );
  }
  return (
    <div className="flex items-center">
      <InfoIcon className="mr-2 h-5 w-5" />
      {count === 1 ? "One member found" : `${count} members found`}
    </div>
  );
}
