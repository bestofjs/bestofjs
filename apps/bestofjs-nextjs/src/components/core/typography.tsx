import { linkVariants } from "../ui/link";

type Props = {
  icon?: React.ReactNode;
  subtitle?: React.ReactNode;
  title: React.ReactNode;
};
export const PageHeading = ({ icon, subtitle, title }: Props) => {
  return (
    <div className="mb-6 flex items-center">
      {icon && <div className="pr-2 text-yellow-500">{icon}</div>}
      <div className="grow">
        <h1 className="text-3xl font-serif">{title}</h1>
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
      className={linkVariants()}
      href={fullURL}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
};
