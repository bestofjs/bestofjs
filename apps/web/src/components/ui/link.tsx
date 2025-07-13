import { cva } from "class-variance-authority";

export const linkVariants = cva(
  [
    "whitespace-nowrap font-sans text-[var(--link-foreground)]",
    "decoration-[var(--link-underline)] hover:underline",
  ],
  {
    variants: {
      variant: {
        project: "hover:underline-offset-8",
        tag: "hover:underline-offset-8",
      },
    },
  },
);
