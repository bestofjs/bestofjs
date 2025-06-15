"use client";

import * as React from "react";
import NextLink, { type LinkProps } from "next/link";
import { usePathname } from "next/navigation";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

export function Header() {
  return (
    <header className="flex h-16 items-center border-b">
      <div className="container flex items-center gap-4">
        <NextLink href="/" className="text-lg font-bold">
          Best of JS Admin
        </NextLink>
        <NavigationMenu className="relative z-10 flex max-w-max flex-1 items-center justify-center">
          <NavigationMenuList className="group flex flex-1 list-none items-center justify-center space-x-1">
            <NavigationMenuItem>
              <Link href="/projects">Projects</Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/tags">Tags</Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
}

const Link = ({ href, ...props }: React.PropsWithChildren<LinkProps>) => {
  const pathname = usePathname();
  const isActive = href === pathname;

  return (
    <NavigationMenuLink
      asChild
      active={isActive}
      className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
    >
      <NextLink href={href} className="NavigationMenuLink" {...props} />
    </NavigationMenuLink>
  );
};
