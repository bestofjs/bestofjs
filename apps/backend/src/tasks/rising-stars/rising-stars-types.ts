import { z } from "zod";

/** A repo showing up in Rising Stars rankings, usually maps to a single project except for monorepos such as OXC */
export const risingStarsEntrySchema = z.object({
  name: z.string(),
  slug: z.string(),
  full_name: z.string(),
  description: z.string(),
  stars: z.number().nullable(),
  delta: z.number(),
  monthly: z.array(z.number().nullable().optional()),
  tags: z.array(z.string()),
  owner_id: z.number(),
  icon: z.string().optional(),
  created_at: z.coerce.date(),
  url: z.url().optional(),
});

export type RisingStarsEntry = z.infer<typeof risingStarsEntrySchema>;
