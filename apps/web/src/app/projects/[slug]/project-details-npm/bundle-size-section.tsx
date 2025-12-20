import prettyBytes from "pretty-bytes";

import type { ProjectDetails } from "@repo/db/projects";

import { ChevronRightIcon, ExternalLinkIcon } from "@/components/core";
import { ExternalLink } from "@/components/core/typography";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

type Props = { project: ProjectDetails };
export function BundleSizeSection({ project }: Props) {
  const packageName = project.packages?.[0]?.name;
  const bundle = project.packages?.[0]?.bundles;
  if (!bundle?.size || !bundle.gzip) return null;

  const urls = {
    bundlePhobia: `https://bundlephobia.com/result?p=${packageName}`,
    bundleJs: `https://bundlejs.com/?q=${packageName}&bundle`,
  };
  return (
    <Collapsible>
      <CollapsibleTrigger className="group flex items-center">
        <ChevronRightIcon className="size-6 group-data-[state=open]:rotate-90" />
        Bundle size
        <span className="ml-2 text-muted-foreground">
          <FileSize value={bundle.gzip} /> (Minified + Gzipped)
        </span>
      </CollapsibleTrigger>
      <CollapsibleContent className="py-4">
        <ul className="ml-6 space-y-2">
          <li className="list-disc">
            <FileSize value={bundle.gzip} />
            <span className="ml-2 text-muted-foreground">
              (Minified + Gzipped)
            </span>
          </li>
          <li className="list-disc">
            <FileSize value={bundle.size} />
            <span className="ml-2 text-muted-foreground">(Minified)</span>
          </li>
          <li className="list-disc">
            Bundle in the browser with{" "}
            <ExternalLink url={urls.bundleJs}>
              <span className="font-sans">bundlejs online bundler</span>
              <ExternalLinkIcon className="size-4" />
            </ExternalLink>
          </li>
          <li className="list-disc">
            View details on{" "}
            <ExternalLink url={urls.bundlePhobia}>
              <span className="font-sans">Bundle Phobia</span>
              <ExternalLinkIcon className="size-4" />
            </ExternalLink>
          </li>
        </ul>
      </CollapsibleContent>
    </Collapsible>
  );
}

export const FileSize = ({ value }: { value: number }) => {
  if (!value) return null;
  return <span className="font-sans">{prettyBytes(value)}</span>;
};
