import Image from "next/image";
import NextLink from "next/link";

import {
  APP_DISPLAY_NAME,
  RISING_STARS_URL,
  STATE_OF_JS_URL,
} from "@/config/site";
import { Separator } from "@/components/ui/separator";

import { ExternalLink } from "../core/typography";
import { VercelLogo } from "../svg-logos";

export const Footer = () => {
  return (
    <footer className="bg-base-200 text-base-content border-t">
      <div className="container">
        <div className="grid gap-8 py-10 sm:grid-cols-[200px_1fr_1fr]">
          <div>
            <Image
              src="/logo.png"
              alt="Best of JS logo"
              width="100"
              height="56"
            />
          </div>
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Direct links</div>
            <div className="flex flex-col gap-2">
              <NextLink href="/projects" className="hover:underline">
                Projects
              </NextLink>
              <NextLink href="/tags" className="hover:underline">
                Tags
              </NextLink>
              <NextLink href="/rankings/monthly" className="hover:underline">
                Monthly Rankings
              </NextLink>
              <NextLink href="/hall-of-fame" className="hover:underline">
                JavaScript Hall of Fame
              </NextLink>
              <NextLink href="/about" className="hover:underline">
                About
              </NextLink>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">
              Related projects
            </div>
            <div className="flex flex-col gap-2">
              <a
                href={RISING_STARS_URL}
                className="hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                Rising Stars
              </a>
              <a
                href={STATE_OF_JS_URL}
                className="hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                State of JS
              </a>
            </div>
          </div>
        </div>
        <Separator />
        <div className="flex flex-col gap-4 py-8 font-serif">
          <div className="flex items-center justify-center">
            <p>
              <i>{APP_DISPLAY_NAME}</i> is a project by{" "}
              <ExternalLink url="https://michaelrambeau.com/">
                Michael Rambeau
              </ExternalLink>
              , made in Osaka, Japan.
            </p>
          </div>
          <div className="flex items-center justify-center gap-1">
            <div>Powered by</div>
            <a
              href="https://vercel.com?utm_source=bestofjs"
              aria-label="Vercel"
            >
              <VercelLogo width={80} height={18.1} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
