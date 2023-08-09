"use client";

// https://nextjs.org/docs/app/api-reference/functions/use-pathname
// > Reading the current URL from a Server Component is not supported.
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { mainNavItems } from "@/config/site";
import { cn } from "@/lib/utils";
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
      </div>
    </>
  );
}
