"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ProjectSearchQuery, SearchQueryUpdater } from "@/app/projects/types";

import { stateToQueryString } from "../project-list/navigation-state";
import { useSearchState } from "../project-list/search-state";

type Props = {
  allTags: BestOfJS.Tag[];
  currentTagCodes: string[];
};

export function SearchPageTagPicker(props: Props) {
  const searchState = useSearchState();
  const router = useRouter();

  const buildPageURL = (updater: SearchQueryUpdater<ProjectSearchQuery>) => {
    const nextState = updater(searchState);
    const queryString = stateToQueryString(nextState);
    return "/projects?" + queryString;
  };

  const onChange = (tagCode: string) => {
    const url = buildPageURL((state) => ({
      ...state,
      tags: [...state.tags, tagCode],
      page: 1,
    }));

    router.push(url);
  };

  return <TagPicker {...props} onChange={onChange} />;
}

export function TagPicker({
  allTags,
  currentTagCodes,
  onChange,
}: Props & { onChange: (tagCode: string) => void }) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between"
        >
          Pick a tag...
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[400px] p-0">
        <Command filter={filterTag}>
          <CommandInput placeholder="Search tag..." />
          <CommandEmpty>No tag found.</CommandEmpty>
          <div className="max-h-72 overflow-y-auto">
            <CommandGroup>
              {allTags.map((tag) => (
                <CommandItem
                  key={tag.code}
                  onSelect={(currentValue) => {
                    setValue(tag.code);
                    onChange(tag.code);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      currentTagCodes.includes(tag.code)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {tag.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </div>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function filterTag(value: string, search: string) {
  if (value.startsWith(search)) return 1;
  if (value.includes(search)) return 0.5;
  return 0;
}
