import { z } from "zod";

export const projectSchema = z.object({
  name: z.string(),
  slug: z.string().optional(), // make it required after data is cleaned up
  full_name: z.string(),
  description: z.string(),
  stars: z.number().nullable(),
  delta: z.number(),
  monthly: z.array(z.number().nullable().optional()),
  tags: z.array(z.string()),
  owner_id: z.number(),
  icon: z.string().optional(),
  created_at: z.coerce.date(),
  url: z.string().optional(),
});

export type Project = z.infer<typeof projectSchema>;
