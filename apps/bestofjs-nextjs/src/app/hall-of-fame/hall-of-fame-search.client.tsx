"use client";

import { useRef } from "react";
import invariant from "tiny-invariant";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchIcon, XMarkIcon } from "@/components/core";

export function HallOfFameSearchBar({
  query,
  onSubmit,
  onReset,
}: {
  query: string;
  onSubmit: (value: string) => void;
  onReset: () => void;
}) {
  const ref = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(ref.current?.value || "");
  };

  const handleReset = () => {
    invariant(ref.current);
    ref.current.value = "";
    ref.current.focus();
    onReset();
  };

  return (
    <form
      className="mb-4 flex w-full space-x-4"
      onSubmit={handleSubmit}
      autoComplete="off"
    >
      <Input
        autoFocus
        autoComplete="off"
        autoCorrect="false"
        spellCheck="false"
        type="text"
        placeholder="Filter by name or username"
        name="query"
        defaultValue={query}
        ref={ref}
      />
      <Button
        type="button"
        onClick={handleReset}
        disabled={!query}
        variant="outline"
      >
        <span className="mr-2 hidden md:inline">Reset</span>
        <XMarkIcon size={20} />
      </Button>
      <Button type="submit">
        <span className="mr-2 hidden md:inline">Search</span>
        <SearchIcon size={20} />
      </Button>
    </form>
  );
}
