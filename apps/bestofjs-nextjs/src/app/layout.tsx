import "@/app/globals.css";
import { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";

import {
  APP_CANONICAL_URL,
  APP_DESCRIPTION,
  APP_DISPLAY_NAME,
} from "@/config/site";
import { fontSans, fontSerif } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { Footer } from "@/components/footer/footer";
import { SiteHeader } from "@/components/header/site-header";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: {
    default: APP_DISPLAY_NAME,
    template: `${APP_DISPLAY_NAME} • %s`,
  },
  description: APP_DESCRIPTION,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  metadataBase: getMetadataRootURL(),
  openGraph: {
    images: [`/api/og?date=${new Date().toISOString().slice(0, 10)}`], // to avoid caching issues as the image is supposed to change every day
    url: APP_CANONICAL_URL,
    title: APP_DISPLAY_NAME,
    description: APP_DESCRIPTION,
  },
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
            fontSerif.variable
          )}
        >
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="relative flex min-h-screen flex-col">
              <SiteHeader />
              <div className="flex-1 bg-muted dark:bg-background">
                <div className="container pb-8 pt-6 md:py-10">{children}</div>
              </div>
              <Footer />
            </div>
            <TailwindIndicator />
          </ThemeProvider>
          <Analytics />
        </body>
      </html>
    </>
  );
}
