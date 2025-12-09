import { z } from 'zod';

export const createShortUrlSchema = z.object({
  destination_url: z.string().url({ message: "Invalid URL format" }),
  slug: z.string().optional(),
});

export type CreateShortUrlInput = z.infer<typeof createShortUrlSchema>;
