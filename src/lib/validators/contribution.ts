import { z } from 'zod';

/** Transforms empty string to null, then validates as URL if non-null */
const optionalUrl = z
  .string()
  .transform((v) => (v === '' ? null : v))
  .pipe(z.string().url().nullable())
  .nullable()
  .default(null);

/** Transforms empty string to null, with optional max length */
function optionalStringWithMax(max: number) {
  return z
    .string()
    .transform((v) => (v === '' ? null : v))
    .pipe(z.string().max(max).nullable())
    .nullable()
    .default(null);
}

const optionalString = optionalStringWithMax(214);

const arrayOfStrings = z.array(z.string().min(1).max(200)).min(1).max(10);

export const technologySubmissionSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase kebab-case (e.g. "my-tech")'),
  category: z.string().min(1).max(50),
  description: z.string().min(1).max(2000),
  logo_url: optionalUrl,
  website_url: optionalUrl,
  github_url: optionalUrl,
  npm_package: optionalString,
  github_stars: z.number().int().min(0).nullable().default(null),
  npm_weekly_downloads: z.number().int().min(0).nullable().default(null),
  pros: arrayOfStrings,
  cons: arrayOfStrings,
  best_for: arrayOfStrings,
  learning_curve: z.enum(['beginner', 'intermediate', 'advanced']),
  community_size: z.enum(['small', 'medium', 'large']),
  maturity: z.enum(['emerging', 'growing', 'mature', 'declining']),
  metadata: z.record(z.string(), z.unknown()).default({}),
});

export type TechnologySubmissionInput = z.infer<typeof technologySubmissionSchema>;
