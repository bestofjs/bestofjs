import { klass } from "@klass/core";

export const linkVariants = klass({
  base: [
    "whitespace-nowrap text-[var(--orange-11)]",
    "decoration-[var(--orange-8)] hover:underline",
  ],
  variants: {
    variant: {
      project: "hover:underline-offset-8",
    },
  },
});
