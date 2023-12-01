import { klass } from "@klass/core";

export const linkVariants = klass({
  base: [
    "whitespace-nowrap text-[var(--link-foreground)] font-sans",
    "decoration-[var(--link-underline)] hover:underline",
  ],
  variants: {
    variant: {
      project: "hover:underline-offset-8",
      tag: "hover:underline-offset-8",
    },
  },
});
