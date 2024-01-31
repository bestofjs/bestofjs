"use client";

import { useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Input } from "@/components/ui/input";

type Props = {
  text?: string;
};

export function SearchBox({ text }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const ref = useRef<HTMLInputElement>(null);

  const onSubmit = () => {
    const value = ref.current?.value;
    if (!value) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("text", value);
    params.set("offset", 0);
    router.push(pathname + "?" + params.toString());
  };

  return (
    <form onSubmit={onSubmit}>
      <Input
        ref={ref}
        name="text"
        placeholder="Search"
        defaultValue={text}
        className="w-full"
      />
    </form>
  );
}
