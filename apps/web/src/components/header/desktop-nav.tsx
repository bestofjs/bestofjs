"use client";

import { Suspense } from "react";
// https://nextjs.org/docs/app/api-reference/functions/use-pathname
// > Reading the current URL from a Server Component is not supported.
import Link from "next/link";
import { usePathname } from "next/navigation";

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
import { extraNavItems, mainNavItems, RISING_STARS_URL } from "@/config/site";
import { cn } from "@/lib/utils";

import { ChevronDownIcon } from "../core";
import { BestOfJSLogo } from "../svg-logos";
import { MobileMenuButton } from "./mobile-nav";

export function MainNav() {
  return (
    <>
      <div className="mr-4 lg:hidden">
        <MobileMenuButton />
      </div>
      <div className="flex gap-6 lg:gap-8">
        <Link
          href="/"
          className="flex items-center space-x-2"
          aria-label="Best of JS"
        >
          <BestOfJSLogo
            width={130}
            height={37.15}
            className="h-[37.15px] w-[130px] text-(--logo-color)"
          />
        </Link>
        <div className="hidden gap-2 lg:flex">
          {/*
          Suspense block needed because `usePathname` is uncached data when
          `cacheComponents` is enabled and the route has a dynamic param without
          `generateStaticParams` (e.g. `/projects/[slug]`). Without a boundary the
          whole route cannot be prerendered.
          https://nextjs.org/docs/messages/blocking-route
          */}
          <Suspense fallback={<NavItems pathname={null} />}>
            <ActiveNavItems />
          </Suspense>
          <MoreLinksButton />
        </div>
      </div>
    </>
  );
}

function ActiveNavItems() {
  const pathname = usePathname();
  return <NavItems pathname={pathname} />;
}

/** `pathname` is `null` while it is not available yet: no item is highlighted. */
function NavItems({ pathname }: { pathname: string | null }) {
  return (
    <nav className="flex items-center gap-2">
      {mainNavItems?.map(
        (item, index) =>
          item.href && (
            <Link
              key={index}
              href={item.href}
              className={cn(
                "flex h-9 items-center p-2 font-medium text-sm",
                "text-muted-foreground hover:bg-(--sand-3) hover:text-foreground",
                "rounded",
                pathname && item.isActive(pathname)
                  ? "text-foreground"
                  : undefined,
                item.disabled && "cursor-not-allowed opacity-80",
              )}
            >
              {item.title}
            </Link>
          ),
      )}
    </nav>
  );
}

export function MoreLinksButton() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="text-muted-foreground">
          More
          <ChevronDownIcon className="size-4" />
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
