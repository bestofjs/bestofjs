import { cn } from "@/lib/utils";

import { linkVariants } from "../ui/link";

type Props = {
  icon?: React.ReactNode;
  subtitle?: React.ReactNode;
  title: React.ReactNode;
};
export const PageHeading = ({ icon, subtitle, title }: Props) => {
  return (
    <div className="mb-6 flex items-center">
      {icon && <div className="pr-2 text-[var(--icon-color)]">{icon}</div>}
      <div className="grow font-serif">
        <h1 className="text-3xl">{title}</h1>
        {subtitle && (
          <div className="mt-2 text-muted-foreground">{subtitle}</div>
        )}
      </div>
    </div>
  );
};

/*
Link to external websites, that open in a new browser tab
See https://mathiasbynens.github.io/rel-noopener
*/
export const ExternalLink = ({
  url,
  children,
}: {
  url: string;
  children: React.ReactNode;
} & Partial<Omit<HTMLAnchorElement, "children">>) => {
  const fullURL = url.startsWith("http") ? url : `http://` + url;
  return (
    <a
      className={cn(linkVariants(), "inline-flex items-center gap-2")}
      href={fullURL}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
};
