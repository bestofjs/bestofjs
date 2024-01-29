import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "@/app/globals.css";

import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Best of JS Admin",
};

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        {children}
      </body>
    </html>
  );
}
