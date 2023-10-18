"use client";

import { useState } from "react";
import { InfoIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { searchHallOfFameMembers } from "./actions";
import { HallOfFameSearchBar } from "./hall-of-fame-search.client";
import { HallOfFameMemberList } from "./hall-of-member-list";

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

  if (isPending) return <>Searching...</>;

  return (
    <>
      <HallOfFameSearchBar
        query={query}
        onSubmit={onSearch}
        onReset={onReset}
      />
      {query ? (
        <>
          <div className="mb-4 text-muted-foreground">
            <DescribeSearchResults count={results.length} />
          </div>
          <HallOfFameMemberList members={results} />
        </>
      ) : (
        initialContent
      )}
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
