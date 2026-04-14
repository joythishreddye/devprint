import { z } from 'zod';

const urlOrNull = z
  .string()
  .transform((v) => (v === '' ? null : v))
  .pipe(z.string().url().nullable());

const nullableUrl = z.union([z.null(), urlOrNull]);

const stringOrNull = z
  .string()
  .transform((v) => (v === '' ? null : v))
  .pipe(z.string().nullable());

const intOrNull = z
  .number()
  .int()
  .min(0)
  .nullable();

const arrayOfStrings = z
  .array(z.string().min(1).max(200))
  .min(1)
  .max(10);

export const technologySubmissionSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase kebab-case (e.g. "my-tech")'),
  category: z.string().min(1).max(50),
  description: z.string().min(1).max(2000),
  logo_url: z
    .string()
    .transform((v) => (v === '' ? null : v))
    .pipe(z.string().url().nullable())
    .nullable()
    .default(null),
  website_url: nullableUrl.nullable().default(null),
  github_url: nullableUrl.nullable().default(null),
  npm_package: stringOrNull.nullable().default(null),
  github_stars: intOrNull.default(null),
  npm_weekly_downloads: intOrNull.default(null),
  pros: arrayOfStrings,
  cons: arrayOfStrings,
  best_for: arrayOfStrings,
  learning_curve: z.enum(['beginner', 'intermediate', 'advanced']),
  community_size: z.enum(['small', 'medium', 'large']),
  maturity: z.enum(['emerging', 'growing', 'mature', 'declining']),
  metadata: z.record(z.unknown()).default({}),
});

export type TechnologySubmissionInput = z.infer<typeof technologySubmissionSchema>;
