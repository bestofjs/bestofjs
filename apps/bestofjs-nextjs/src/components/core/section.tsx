import React from "react";

import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
};
export const SectionHeading = ({ className, icon, title, subtitle }: Props) => {
  return (
    <div className={cn("flex items-center", className)}>
      {icon && (
        <div className="pr-2 text-yellow-500 dark:text-yellow-400">{icon}</div>
      )}
      <div className="grow">
        <h2 className="text-2xl">{title}</h2>
        {subtitle && (
          <div className="uppercase text-muted-foreground">{subtitle}</div>
        )}
      </div>
    </div>
  );
};
