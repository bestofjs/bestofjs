"use client";

// https://nextjs.org/docs/app/api-reference/functions/use-pathname
// > Reading the current URL from a Server Component is not supported.
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";

import { RISING_STARS_URL, extraNavItems, mainNavItems } from "@/config/site";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icons } from "@/components/icons";

import { MobileMenuButton } from "./mobile-nav";

export function MainNav() {
  const pathname = usePathname();

  return (
    <>
      <div className="md:hidden">
        <MobileMenuButton />
      </div>
      <div className="hidden gap-6 md:flex md:gap-8">
        <Link
          href="/"
          className="flex items-center space-x-2"
          aria-label="Best of JS"
        >
          <Icons.logo
            width={130}
            height={37.15}
            className="h-[37.15px] w-[130px] text-primary"
          />
        </Link>
        <div className="flex gap-4">
          <nav className="flex gap-6">
            {mainNavItems?.map(
              (item, index) =>
                item.href && (
                  <Link
                    key={index}
                    href={item.href}
                    className={cn(
                      "flex items-center text-sm font-medium text-muted-foreground hover:text-foreground/80",
                      item.isActive(pathname)
                        ? "text-foreground"
                        : "text-foreground/60",
                      item.disabled && "cursor-not-allowed opacity-80"
                    )}
                  >
                    {item.title}
                  </Link>
                )
            )}
          </nav>
          <MoreLinksButton />
        </div>
      </div>
    </>
  );
}

export function MoreLinksButton() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="sm"
          variant="ghost"
          className={cn("text-muted-foreground")}
        >
          More
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60" align="end" sideOffset={0}>
        <DropdownMenuLabel className="text-xs">Links</DropdownMenuLabel>
        <DropdownMenuGroup>
          {extraNavItems.map((navItem) => {
            return (
              <DropdownMenuItem key={navItem.href} asChild>
                <Link href={navItem.href}>{navItem.title}</Link>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs">
          Related projects
        </DropdownMenuLabel>
        <DropdownMenuItem>
          <a href={RISING_STARS_URL}>JavaScript Rising Stars</a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
