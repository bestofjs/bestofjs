import { prettyBytes } from "@/helpers/pretty-bytes";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ExternalLink } from "@/components/core/typography";
import { Icons } from "@/components/icons";

type Props = { project: BestOfJS.ProjectDetails };
export function BundleSizeSection({ project }: Props) {
  const urls = {
    bundlePhobia: `https://bundlephobia.com/result?p=${project.packageName}`,
    bundleJs: `https://bundlejs.com/?q=${project.packageName}&bundle`,
  };
  return (
    <Collapsible>
      <CollapsibleTrigger className="group flex items-center">
        <Icons.chevronRightIcon className="h-6 w-6 group-data-[state=open]:rotate-90" />
        Bundle size
        <span className="ml-2 text-muted-foreground">
          <FileSize value={project.bundle.gzip} /> (Minified + Gzipped)
        </span>
      </CollapsibleTrigger>
      <CollapsibleContent className="py-4">
        <ul className="ml-6 space-y-2">
          <li className="list-disc">
            <FileSize value={project.bundle.gzip} />
            <span className="ml-2 text-muted-foreground">
              (Minified + Gzipped)
            </span>
          </li>
          <li className="list-disc">
            <FileSize value={project.bundle.size} />
            <span className="ml-2 text-muted-foreground">(Minified)</span>
          </li>
          <li className="list-disc">
            Bundle in the browser with{" "}
            <ExternalLink url={urls.bundleJs}>
              <span className="font-sans">bundlejs online bundler</span>
              <Icons.externalLink className="h-4 w-4" />
            </ExternalLink>
          </li>
          <li className="list-disc">
            View details on{" "}
            <ExternalLink url={urls.bundlePhobia}>
              <span className="font-sans">Bundle Phobia</span>
              <Icons.externalLink className="h-4 w-4" />
            </ExternalLink>
          </li>
        </ul>
      </CollapsibleContent>
    </Collapsible>
  );
}

export const FileSize = ({ value }: { value: number }) => {
  if (!value || isNaN(value)) return null;
  return <span className="font-sans">{prettyBytes(value)}</span>;
};
