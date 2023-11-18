import type { VariantsOf } from "@klass/core";
import { klassed } from "@klass/react";
import { twMerge } from "tailwind-merge";

export type ButtonVariants = VariantsOf<typeof Button.klass>;

const Button = klassed(
  "button",
  {
    base: [
      "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-50",
    ],
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-hover",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border bg-card hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
  {
    it: twMerge,
  }
);

const buttonVariants = Button.klass;

export { Button, buttonVariants };
