"use client";

import * as React from "react";
import { Check, PlusIcon } from "lucide-react";

import type { ProjectDetails } from "@repo/db/projects";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type Tag = ProjectDetails["tags"][number];

type Props = {
  allTags: Tag[];
  values: string[];
  onChange: (values: string[]) => void;
};

export function TagPicker({ allTags, values, onChange }: Props) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          Add tag
          <PlusIcon className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty>No tag found.</CommandEmpty>
            <CommandGroup>
              {allTags.map((tag) => (
                <CommandItem
                  key={tag.id}
                  value={tag.name}
                  onSelect={() => {
                    onChange([...values, tag.id]);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 size-4",
                      values.includes(tag.id) ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {tag.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
