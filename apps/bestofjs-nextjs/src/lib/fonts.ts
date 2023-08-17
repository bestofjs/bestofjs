import {
  JetBrains_Mono as FontMono,
  Inter as FontSans,
  Roboto_Slab,
} from "next/font/google";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const fontSerif = Roboto_Slab({
  subsets: ["latin"],
  variable: "--font-serif",
});
