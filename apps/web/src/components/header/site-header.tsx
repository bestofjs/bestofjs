import { Suspense } from "react";
import Link from "next/link";

import { DiscordIcon, GitHubIcon } from "@/components/core/icons";
import { MainNav } from "@/components/header/desktop-nav";
import { ClientSearchRoot } from "@/components/search-palette/search-root";
import { ThemeToggle } from "@/components/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import { APP_REPO_URL, DISCORD_URL } from "@/config/site";

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
              <div className="text-muted-foreground text-sm">
                Loading search...
              </div>
            }
          >
            <ClientSearchRoot />
          </Suspense>
          <nav className="flex items-center gap-1">
            <Link
              href={APP_REPO_URL}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline"
            >
              <div
                className={buttonVariants({
                  size: "sm",
                  variant: "ghost",
                })}
              >
                <GitHubIcon size={24} />
                <span className="sr-only">GitHub</span>
              </div>
            </Link>
            <Link
              href={DISCORD_URL}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline"
            >
              <div
                className={buttonVariants({
                  size: "sm",
                  variant: "ghost",
                })}
              >
                <DiscordIcon size={24} />
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
