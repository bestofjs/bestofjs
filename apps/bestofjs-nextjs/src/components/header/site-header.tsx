import { Suspense } from "react";
import Link from "next/link";

import { APP_REPO_URL, DISCORD_URL } from "@/config/site";
import { buttonVariants } from "@/components/ui/button";
import { MainNav } from "@/components/header/desktop-nav";
import { Icons } from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggle";
import { SearchContainer } from "@/app/search-container";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <MainNav />
        <div className="flex flex-1 items-center justify-end space-x-4">
          {/*
          Suspense block needed to avoid the "deopted into client-side rendering"
          https://nextjs.org/docs/messages/deopted-into-client-rendering
          */}
          <Suspense
            fallback={
              <div className="text-sm text-muted-foreground">
                Loading search...
              </div>
            }
          >
            <SearchContainer />
          </Suspense>
          <nav className="flex items-center space-x-1">
            <Link href={APP_REPO_URL} target="_blank" rel="noreferrer">
              <div
                className={buttonVariants({
                  size: "sm",
                  variant: "ghost",
                })}
              >
                <Icons.gitHub className="h-5 w-5" width={20} height={20} />
                <span className="sr-only">GitHub</span>
              </div>
            </Link>
            <Link href={DISCORD_URL} target="_blank" rel="noreferrer">
              <div
                className={buttonVariants({
                  size: "sm",
                  variant: "ghost",
                })}
              >
                <Icons.discord className="h-5 w-5" width={20} height={20} />
                <span className="sr-only">GitHub</span>
              </div>
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
