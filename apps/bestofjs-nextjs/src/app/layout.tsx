import "@/app/globals.css";
import { Metadata } from "next";

import { APP_DISPLAY_NAME } from "@/config/site";
import { fontSans } from "@/lib/fonts";
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
  description:
    "Check out the most popular open-source projects and the latest trends about the web platform: React, Vue.js, Node.js, Deno, Bun... The best of JavaScript, TypeScript and friends!",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

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
            fontSans.variable
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
        </body>
      </html>
    </>
  );
}
