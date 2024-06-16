"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ProjectListOrderByKey } from "@repo/db/projects/find";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const options = [
  { value: "-stars", text: "By stars DESC" },
  { value: "stars", text: "By stars ASC" },
  { value: "-createdAt", text: "By date of addition (Newest first)" },
  { value: "createdAt", text: "By date of addition (Oldest first)" },
];

type Props = {
  sort: ProjectListOrderByKey;
};
export function ProjectListSortOptionPicker({ sort }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const onChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    params.set("offset", "0");
    router.push(pathname + "?" + params.toString());
  };
  return (
    <Select onValueChange={onChange} value={sort}>
      <SelectTrigger className="w-[300px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.text}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
