import type React from "react";

import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
};
export const SectionHeading = ({ className, icon, title, subtitle }: Props) => {
  return (
    <div className={cn("flex w-full items-center", className)}>
      {icon && <div className="pr-2 text-[var(--icon-color)]">{icon}</div>}
      <div className="grow">
        <h2 className="font-serif text-2xl">{title}</h2>
        {subtitle && <div className="text-muted-foreground">{subtitle}</div>}
      </div>
    </div>
  );
};
