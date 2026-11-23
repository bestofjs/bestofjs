import type { Metadata } from "next";

import { isMainApp } from "@/config/apps";
import { APP_CANONICAL_URL } from "@/config/site";

import { markdownURL } from "./urls";
export function markdownMetadata(path: string): Metadata {
  return isMainApp
    ? {
        alternates: {
          canonical: new URL(path, APP_CANONICAL_URL).toString(),
          types: {
            "text/markdown": new URL(
              markdownURL(path),
              APP_CANONICAL_URL,
            ).toString(),
          },
        },
      }
    : {};
}
