import type { Metadata } from "next";
import Image from "next/image";

import { PublicContent } from "@/components/public-content";
import { markdownMetadata } from "@/server/markdown/metadata";
import { publicContent } from "@/server/public-content";

export const metadata: Metadata = {
  title: publicContent.about.title,
  ...markdownMetadata("/about"),
};
export default function Page() {
  return (
    <PublicContent page="about">
      <p>
        {publicContent.about.closing}{" "}
        <Image
          className="inline"
          src="/images/star.png"
          width={16}
          height={16}
          alt=""
        />
      </p>
      <p>— {publicContent.about.signature}</p>
    </PublicContent>
  );
}
