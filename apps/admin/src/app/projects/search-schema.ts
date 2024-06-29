import { z } from "zod";

export const searchSchema = z.object({
  limit: z.coerce.number().default(50),
  offset: z.coerce.number().default(0),
  sort: z.string().default("-createdAt"),
  tag: z.string().optional(),
  text: z.string().optional(),
});
