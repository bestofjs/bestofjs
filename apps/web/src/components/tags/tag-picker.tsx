"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { useRouter } from "next/navigation";

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
import { cn } from "@/lib/utils";

import { useProjectSearchState } from "../search-palette/search-state.client";

type Props = {
  allTags: BestOfJS.Tag[];
  currentTagCodes: string[];
};

export function SearchPageTagPicker(props: Props) {
  const { buildPageURL } = useProjectSearchState();
  const router = useRouter();

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
  const [, setValue] = React.useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          aria-expanded={open}
          className="justify-between"
        >
          Pick a tag...
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
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
                  onSelect={() => {
                    setValue(tag.code);
                    onChange(tag.code);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 size-4",
                      currentTagCodes.includes(tag.code)
                        ? "opacity-100"
                        : "opacity-0",
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
