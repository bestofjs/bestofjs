"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bars3Icon } from "@heroicons/react/20/solid";

import {
  APP_REPO_URL,
  DISCORD_URL,
  extraNavItems,
  mainNavItems,
} from "@/config/site";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { BestOfJSLogo } from "../svg-logos";

export function MobileMenuButton() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Menu">
          <Bars3Icon className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SidebarContent onOpenChange={setIsOpen} />
      </SheetContent>
    </Sheet>
  );
}

function SidebarContent({
  onOpenChange,
}: {
  onOpenChange: (open: boolean) => void;
}) {
  const pathname = usePathname();
  const allNavItems = [...mainNavItems, ...extraNavItems];

  return (
    <>
      <Link
        href="/"
        className="mb-4 flex items-center space-x-2"
        aria-label="Best of JS"
      >
        <BestOfJSLogo
          width={130}
          height={37.15}
          className="h-[37.15px] w-[130px] text-primary"
        />
      </Link>
      <div className="w-full space-y-2">
        {allNavItems.map(
          (item, index) =>
            item.href && (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  "flex items-center",
                  item.isActive(pathname)
                    ? "text-foreground"
                    : "text-foreground/70",
                  item.disabled && "cursor-not-allowed opacity-80"
                )}
                onClick={() => onOpenChange(false)}
              >
                {item.title}
              </Link>
            )
        )}
        <Separator />
        <div className="space-y-2">
          <a
            href={DISCORD_URL}
            target="_blank"
            rel="noreferrer"
            className="block text-foreground/70"
          >
            Discord
          </a>
          <a
            href={APP_REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="block text-foreground/70"
          >
            GitHub
          </a>
        </div>
      </div>
    </>
  );
}
