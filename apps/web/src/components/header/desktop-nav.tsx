"use client";

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

export function MainNav({ badge }: { badge?: React.ReactNode }) {
  const pathname = usePathname();
  return <MainNavContent pathname={pathname} badge={badge} />;
}

export function MainNavFallback({ badge }: { badge?: React.ReactNode }) {
  return <MainNavContent badge={badge} />;
}

function MainNavContent({
  pathname,
  badge,
}: {
  pathname?: string;
  badge?: React.ReactNode;
}) {
  return (
    <>
      <div className="mr-4 lg:hidden">
        <MobileMenuButton />
      </div>
      <div className="flex gap-6 lg:gap-8">
        {/*
        `relative` so the deployment badge can hang off the logo's top-right
        corner, `z-0` so the badge's negative z-index stays trapped in this
        wrapper: without it the badge would slide behind the header's own
        background — the header is `sticky z-40`, so it paints as one layer —
        and disappear entirely instead of tucking under the logo.

        The badge sits outside the `<Link>` on purpose: the link's `aria-label`
        would hide any text nested inside it from screen readers.
        */}
        <div className="relative z-0 flex items-center">
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
          {badge}
        </div>
        <div className="hidden gap-2 lg:flex">
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
