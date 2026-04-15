import { z } from 'zod';

// ─── Per-step enum schemas ────────────────────────────────────────────────────

export const projectTypeSchema = z.enum(
  ['web-app', 'api-service', 'mobile-app', 'static-site', 'cli-tool', 'monorepo'],
  { error: 'Invalid project type' },
);

export const architectureSchema = z.enum(
  ['monolith', 'microservices', 'serverless', 'jamstack', 'modular-monolith'],
  { error: 'Invalid architecture' },
);

export const frontendSchema = z.enum(
  ['Next.js', 'React', 'Vue', 'SvelteKit', 'Nuxt', 'Angular', 'Astro', 'None'],
  { error: 'Invalid frontend framework' },
);

export const stylingSchema = z.enum(
  ['Tailwind CSS', 'CSS Modules', 'Styled Components', 'Sass', 'Vanilla CSS', 'None'],
  { error: 'Invalid styling option' },
);

export const backendSchema = z.enum(
  ['Node.js', 'Express', 'Fastify', 'Django', 'Flask', 'Rails', 'Go', 'None'],
  { error: 'Invalid backend' },
);

export const databaseSchema = z.enum(
  ['PostgreSQL', 'MySQL', 'MongoDB', 'SQLite', 'Redis', 'Supabase', 'PlanetScale', 'None'],
  { error: 'Invalid database' },
);

export const authSchema = z.enum(
  ['Supabase Auth', 'NextAuth.js', 'Clerk', 'Auth0', 'Firebase Auth', 'Custom JWT', 'None'],
  { error: 'Invalid auth strategy' },
);

export const hostingSchema = z.enum(
  ['Vercel', 'Netlify', 'AWS', 'Railway', 'Fly.io', 'DigitalOcean', 'Cloudflare Pages'],
  { error: 'Invalid hosting provider' },
);

export const cicdSchema = z.enum(
  ['GitHub Actions', 'GitLab CI', 'CircleCI', 'Jenkins', 'None'],
  { error: 'Invalid CI/CD option' },
);

export const testingSchema = z.enum(
  ['Vitest', 'Jest', 'Playwright', 'Cypress', 'None'],
  { error: 'Invalid testing framework' },
);

// ─── Inferred enum types ──────────────────────────────────────────────────────

export type ProjectType = z.infer<typeof projectTypeSchema>;
export type Architecture = z.infer<typeof architectureSchema>;
export type Frontend = z.infer<typeof frontendSchema>;
export type Styling = z.infer<typeof stylingSchema>;
export type Backend = z.infer<typeof backendSchema>;
export type Database = z.infer<typeof databaseSchema>;
export type Auth = z.infer<typeof authSchema>;
export type Hosting = z.infer<typeof hostingSchema>;
export type Cicd = z.infer<typeof cicdSchema>;
export type Testing = z.infer<typeof testingSchema>;

// ─── Step 0: project info ─────────────────────────────────────────────────────

export const wizardProjectInfoSchema = z.object({
  projectName: z
    .string()
    .trim()
    .min(1, 'Project name is required')
    .max(100, 'Project name must be 100 characters or fewer'),
  description: z
    .string()
    .trim()
    .max(500, 'Description must be 500 characters or fewer')
    .default(''),
});

export type WizardProjectInfoInput = z.infer<typeof wizardProjectInfoSchema>;

// ─── Selections (all steps combined) ─────────────────────────────────────────

// Each step field is nullable: null means the user has not yet made a choice.
export const wizardSelectionsSchema = wizardProjectInfoSchema.extend({
  projectType: projectTypeSchema.nullable(),
  architecture: architectureSchema.nullable(),
  frontend: frontendSchema.nullable(),
  styling: stylingSchema.nullable(),
  backend: backendSchema.nullable(),
  database: databaseSchema.nullable(),
  auth: authSchema.nullable(),
  hosting: hostingSchema.nullable(),
  cicd: cicdSchema.nullable(),
  testing: testingSchema.nullable(),
});

export type WizardSelectionsInput = z.infer<typeof wizardSelectionsSchema>;

// ─── Submission schema (JSON envelope from the client) ───────────────────────

/** Maximum raw JSON length accepted — protects against oversized payloads. */
const MAX_SELECTIONS_JSON_LENGTH = 10_000;

export const wizardSubmissionSchema = z
  .object({
    selectionsJson: z
      .string()
      .min(1, 'Selections are required')
      .max(MAX_SELECTIONS_JSON_LENGTH, 'Selections payload is too large'),
  })
  .transform((input, ctx) => {
    let parsed: unknown;
    try {
      parsed = JSON.parse(input.selectionsJson);
    } catch {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Selections must be valid JSON',
        path: ['selectionsJson'],
      });
      return z.NEVER;
    }

    const result = wizardSelectionsSchema.safeParse(parsed);
    if (!result.success) {
      for (const issue of result.error.issues) {
        ctx.addIssue({ ...issue, path: ['selectionsJson', ...(issue.path ?? [])] });
      }
      return z.NEVER;
    }

    return { selections: result.data };
  });

export type WizardSubmissionInput = z.infer<typeof wizardSubmissionSchema>;
