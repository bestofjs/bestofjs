import * as React from "react";
import { klass, type VariantsOf } from "@klass/core";

import { cn } from "@/lib/utils";

type BadgeVariants = VariantsOf<typeof badgeVariants>;

const badgeVariants = klass({
  base: [
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
    "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  ],
  variants: {
    variant: {
      default:
        "border-transparent bg-primary text-primary-foreground hover:bg-primary-hover",
      secondary:
        "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary-hover",
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
