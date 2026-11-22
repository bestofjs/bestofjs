import type { Metadata } from "next";

import { PublicContent } from "@/components/public-content";
import { markdownMetadata } from "@/server/markdown/metadata";
import { publicContent } from "@/server/public-content";
export const metadata: Metadata = {
  title: publicContent.contact.title,
  ...markdownMetadata("/contact"),
};
export default function Page() {
  return <PublicContent page="contact" />;
}
