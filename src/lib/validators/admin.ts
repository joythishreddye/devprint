import { z } from 'zod';

const optionalUrl = z
  .string()
  .transform((v) => (v === '' ? null : v))
  .pipe(z.string().url().nullable())
  .nullable()
  .default(null);

const optionalString = z
  .string()
  .transform((v) => (v === '' ? null : v))
  .pipe(z.string().max(214).nullable())
  .nullable()
  .default(null);

const arrayOfStrings = z.array(z.string().min(1).max(200)).min(1).max(10);

export const reviewSubmissionSchema = z.object({
  contributionId: z.string().uuid('Invalid contribution ID'),
  action: z.enum(['approve', 'reject']),
  reviewNotes: z.string().max(500).default(''),
});

export const technologyFormSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase kebab-case'),
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

export const promoteUserSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  newRole: z.enum(['developer', 'contributor', 'admin']),
});

export type ReviewSubmissionInput = z.infer<typeof reviewSubmissionSchema>;
export type TechnologyFormInput = z.infer<typeof technologyFormSchema>;
export type PromoteUserInput = z.infer<typeof promoteUserSchema>;
