import "@/app/globals.css";
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { Header } from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { ModalRoot } from "@/hooks/use-modal";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Best of JS Admin",
};

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <NuqsAdapter>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ModalRoot>
              <Header />
              <main className="container py-4">{children}</main>
              <Toaster />
            </ModalRoot>
          </ThemeProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
