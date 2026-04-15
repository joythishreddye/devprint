import { z } from 'zod';

const slugField = z
  .string()
  .min(1)
  .max(100)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase letters, numbers, and hyphens');

export const technologiesQuerySchema = z.object({
  category: z.string().min(1).max(50).optional(),
});

export const technologySlugSchema = z.object({
  slug: slugField,
});

export const compareQuerySchema = z
  .object({
    a: slugField,
    b: slugField,
  })
  .refine((data) => data.a !== data.b, {
    message: 'Cannot compare a technology with itself',
  });

export type TechnologiesQuery = z.infer<typeof technologiesQuerySchema>;
export type TechnologySlugParam = z.infer<typeof technologySlugSchema>;
export type CompareQuery = z.infer<typeof compareQuerySchema>;
