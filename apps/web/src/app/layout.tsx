import "@/app/globals.css";

import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";

import { Footer } from "@/components/footer/footer";
import { SiteHeader } from "@/components/header/site-header";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  APP_CANONICAL_URL,
  APP_DESCRIPTION,
  APP_DISPLAY_NAME,
} from "@/config/site";
import { fontSans, fontSerif } from "@/lib/fonts";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: {
    default: APP_DISPLAY_NAME,
    template: `${APP_DISPLAY_NAME} • %s`,
  },
  description: APP_DESCRIPTION,
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  metadataBase: getMetadataRootURL(),
  openGraph: {
    url: APP_CANONICAL_URL,
    title: APP_DISPLAY_NAME,
    description: APP_DESCRIPTION,
    images: ["/images/og-home-2025-04-27.png"],
  },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

function getMetadataRootURL() {
  switch (process.env.VERCEL_ENV) {
    case "production":
      return new URL(APP_CANONICAL_URL); // ensure URLs start with https://bestofjs.org in production
    case "preview":
      return new URL(`https://${process.env.VERCEL_URL}`); // https://xxx.vercel.app
    default:
      return new URL(`http://localhost:${process.env.PORT || 3000}`);
  }
}

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable,
            fontSerif.variable,
          )}
        >
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <TooltipProvider>
              <div className="relative flex min-h-screen flex-col">
                <SiteHeader />
                <main className="flex-1 bg-[var(--app-background)]">
                  <div className="container pt-6 pb-8 md:py-8">{children}</div>
                </main>
                <Footer />
              </div>
              <TailwindIndicator />
            </TooltipProvider>
          </ThemeProvider>
          <Analytics />
        </body>
      </html>
    </>
  );
}
