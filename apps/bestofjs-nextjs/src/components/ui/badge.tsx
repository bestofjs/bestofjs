import * as React from "react";
import { klass, type VariantsOf } from "@klass/core";

import { cn } from "@/lib/utils";

type BadgeVariants = VariantsOf<typeof badgeVariants>;

const badgeVariants = klass({
  base: [
    "inline-flex items-center border rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
    "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  ],
  variants: {
    variant: {
      default:
        "bg-primary hover:bg-primary-hover border-transparent text-primary-foreground",
      secondary:
        "bg-secondary hover:bg-secondary-hover border-transparent text-secondary-foreground",
      outline: "text-foreground",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    BadgeVariants {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
