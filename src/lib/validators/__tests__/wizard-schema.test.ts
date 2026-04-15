// @vitest-environment node
import { describe, it, expect } from 'vitest';
import {
  wizardProjectInfoSchema,
  wizardSelectionsSchema,
  wizardSubmissionSchema,
  projectTypeSchema,
  architectureSchema,
  frontendSchema,
  stylingSchema,
  backendSchema,
  databaseSchema,
  authSchema,
  hostingSchema,
  cicdSchema,
  testingSchema,
} from '../wizard-schema';

// ─── Per-step schemas ────────────────────────────────────────────────────────

describe('projectTypeSchema', () => {
  it('accepts all valid project types', () => {
    const valid = ['web-app', 'api-service', 'mobile-app', 'static-site', 'cli-tool', 'monorepo'];
    for (const v of valid) {
      expect(projectTypeSchema.safeParse(v).success).toBe(true);
    }
  });

  it('rejects an unknown project type', () => {
    expect(projectTypeSchema.safeParse('desktop-app').success).toBe(false);
  });

  it('rejects empty string', () => {
    expect(projectTypeSchema.safeParse('').success).toBe(false);
  });
});

describe('architectureSchema', () => {
  it('accepts all valid architecture values', () => {
    const valid = ['monolith', 'microservices', 'serverless', 'jamstack', 'modular-monolith'];
    for (const v of valid) {
      expect(architectureSchema.safeParse(v).success).toBe(true);
    }
  });

  it('rejects an unknown architecture', () => {
    expect(architectureSchema.safeParse('event-driven').success).toBe(false);
  });
});

describe('frontendSchema', () => {
  it('accepts all valid frontend values', () => {
    const valid = ['Next.js', 'React', 'Vue', 'SvelteKit', 'Nuxt', 'Angular', 'Astro', 'None'];
    for (const v of valid) {
      expect(frontendSchema.safeParse(v).success).toBe(true);
    }
  });

  it('rejects an unknown frontend', () => {
    expect(frontendSchema.safeParse('Ember').success).toBe(false);
  });
});

describe('stylingSchema', () => {
  it('accepts all valid styling values', () => {
    const valid = ['Tailwind CSS', 'CSS Modules', 'Styled Components', 'Sass', 'Vanilla CSS', 'None'];
    for (const v of valid) {
      expect(stylingSchema.safeParse(v).success).toBe(true);
    }
  });

  it('rejects an unknown styling option', () => {
    expect(stylingSchema.safeParse('Bootstrap').success).toBe(false);
  });
});

describe('backendSchema', () => {
  it('accepts all valid backend values', () => {
    const valid = ['Node.js', 'Express', 'Fastify', 'Django', 'Flask', 'Rails', 'Go', 'None'];
    for (const v of valid) {
      expect(backendSchema.safeParse(v).success).toBe(true);
    }
  });

  it('rejects an unknown backend', () => {
    expect(backendSchema.safeParse('Spring').success).toBe(false);
  });
});

describe('databaseSchema', () => {
  it('accepts all valid database values', () => {
    const valid = [
      'PostgreSQL', 'MySQL', 'MongoDB', 'SQLite', 'Redis',
      'Supabase', 'PlanetScale', 'None',
    ];
    for (const v of valid) {
      expect(databaseSchema.safeParse(v).success).toBe(true);
    }
  });

  it('rejects an unknown database', () => {
    expect(databaseSchema.safeParse('DynamoDB').success).toBe(false);
  });
});

describe('authSchema', () => {
  it('accepts all valid auth values', () => {
    const valid = ['Supabase Auth', 'NextAuth.js', 'Clerk', 'Auth0', 'Firebase Auth', 'Custom JWT', 'None'];
    for (const v of valid) {
      expect(authSchema.safeParse(v).success).toBe(true);
    }
  });

  it('rejects an unknown auth option', () => {
    expect(authSchema.safeParse('Okta').success).toBe(false);
  });
});

describe('hostingSchema', () => {
  it('accepts all valid hosting values', () => {
    const valid = ['Vercel', 'Netlify', 'AWS', 'Railway', 'Fly.io', 'DigitalOcean', 'Cloudflare Pages'];
    for (const v of valid) {
      expect(hostingSchema.safeParse(v).success).toBe(true);
    }
  });

  it('rejects an unknown hosting option', () => {
    expect(hostingSchema.safeParse('Heroku').success).toBe(false);
  });
});

describe('cicdSchema', () => {
  it('accepts all valid cicd values', () => {
    const valid = ['GitHub Actions', 'GitLab CI', 'CircleCI', 'Jenkins', 'None'];
    for (const v of valid) {
      expect(cicdSchema.safeParse(v).success).toBe(true);
    }
  });

  it('rejects an unknown CI/CD option', () => {
    expect(cicdSchema.safeParse('Bitbucket Pipelines').success).toBe(false);
  });
});

describe('testingSchema', () => {
  it('accepts all valid testing values', () => {
    const valid = ['Vitest', 'Jest', 'Playwright', 'Cypress', 'None'];
    for (const v of valid) {
      expect(testingSchema.safeParse(v).success).toBe(true);
    }
  });

  it('rejects an unknown testing option', () => {
    expect(testingSchema.safeParse('Mocha').success).toBe(false);
  });
});

// ─── wizardProjectInfoSchema ─────────────────────────────────────────────────

describe('wizardProjectInfoSchema', () => {
  const VALID = { projectName: 'My App', description: 'A great app' };

  it('accepts a valid project name and description', () => {
    expect(wizardProjectInfoSchema.safeParse(VALID).success).toBe(true);
  });

  it('accepts an empty description', () => {
    const result = wizardProjectInfoSchema.safeParse({ ...VALID, description: '' });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.description).toBe('');
  });

  it('rejects an empty project name', () => {
    expect(wizardProjectInfoSchema.safeParse({ ...VALID, projectName: '' }).success).toBe(false);
  });

  it('rejects a project name exceeding 100 characters', () => {
    expect(
      wizardProjectInfoSchema.safeParse({ ...VALID, projectName: 'a'.repeat(101) }).success,
    ).toBe(false);
  });

  it('rejects a description exceeding 500 characters', () => {
    expect(
      wizardProjectInfoSchema.safeParse({ ...VALID, description: 'x'.repeat(501) }).success,
    ).toBe(false);
  });

  it('rejects missing projectName field', () => {
    expect(wizardProjectInfoSchema.safeParse({ description: 'desc' }).success).toBe(false);
  });

  it('trims leading/trailing whitespace from projectName', () => {
    const result = wizardProjectInfoSchema.safeParse({ ...VALID, projectName: '  My App  ' });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.projectName).toBe('My App');
  });

  it('produces a clear error message when projectName is empty', () => {
    const result = wizardProjectInfoSchema.safeParse({ ...VALID, projectName: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message);
      expect(messages.some((m) => m.toLowerCase().includes('project name'))).toBe(true);
    }
  });
});

// ─── wizardSelectionsSchema ──────────────────────────────────────────────────

const VALID_SELECTIONS = {
  projectName: 'DevPrint',
  description: 'A cool project',
  projectType: 'web-app',
  architecture: 'monolith',
  frontend: 'Next.js',
  styling: 'Tailwind CSS',
  backend: 'Node.js',
  database: 'PostgreSQL',
  auth: 'Supabase Auth',
  hosting: 'Vercel',
  cicd: 'GitHub Actions',
  testing: 'Vitest',
};

describe('wizardSelectionsSchema', () => {
  it('accepts fully populated valid selections', () => {
    expect(wizardSelectionsSchema.safeParse(VALID_SELECTIONS).success).toBe(true);
  });

  it('accepts null for all step fields (no choice made yet)', () => {
    const nullSelections = {
      ...VALID_SELECTIONS,
      projectType: null,
      architecture: null,
      frontend: null,
      styling: null,
      backend: null,
      database: null,
      auth: null,
      hosting: null,
      cicd: null,
      testing: null,
    };
    expect(wizardSelectionsSchema.safeParse(nullSelections).success).toBe(true);
  });

  it('rejects an invalid projectType value', () => {
    expect(
      wizardSelectionsSchema.safeParse({ ...VALID_SELECTIONS, projectType: 'unknown' }).success,
    ).toBe(false);
  });

  it('rejects an invalid architecture value', () => {
    expect(
      wizardSelectionsSchema.safeParse({ ...VALID_SELECTIONS, architecture: 'unknown' }).success,
    ).toBe(false);
  });

  it('rejects an invalid frontend value', () => {
    expect(
      wizardSelectionsSchema.safeParse({ ...VALID_SELECTIONS, frontend: 'Backbone' }).success,
    ).toBe(false);
  });

  it('rejects an invalid styling value', () => {
    expect(
      wizardSelectionsSchema.safeParse({ ...VALID_SELECTIONS, styling: 'Bootstrap' }).success,
    ).toBe(false);
  });

  it('rejects an invalid backend value', () => {
    expect(
      wizardSelectionsSchema.safeParse({ ...VALID_SELECTIONS, backend: 'Spring' }).success,
    ).toBe(false);
  });

  it('rejects an invalid database value', () => {
    expect(
      wizardSelectionsSchema.safeParse({ ...VALID_SELECTIONS, database: 'DynamoDB' }).success,
    ).toBe(false);
  });

  it('rejects an invalid auth value', () => {
    expect(
      wizardSelectionsSchema.safeParse({ ...VALID_SELECTIONS, auth: 'Okta' }).success,
    ).toBe(false);
  });

  it('rejects an invalid hosting value', () => {
    expect(
      wizardSelectionsSchema.safeParse({ ...VALID_SELECTIONS, hosting: 'Heroku' }).success,
    ).toBe(false);
  });

  it('rejects an invalid cicd value', () => {
    expect(
      wizardSelectionsSchema.safeParse({ ...VALID_SELECTIONS, cicd: 'Travis CI' }).success,
    ).toBe(false);
  });

  it('rejects an invalid testing value', () => {
    expect(
      wizardSelectionsSchema.safeParse({ ...VALID_SELECTIONS, testing: 'Mocha' }).success,
    ).toBe(false);
  });

  it('rejects missing projectName', () => {
    const { projectName: _, ...rest } = VALID_SELECTIONS;
    expect(wizardSelectionsSchema.safeParse(rest).success).toBe(false);
  });

  it('infers correct TypeScript type from parse result', () => {
    const result = wizardSelectionsSchema.safeParse(VALID_SELECTIONS);
    if (result.success) {
      // Type-check: result.data should have projectType as a string | null union
      const _projectType: string | null = result.data.projectType;
      expect(_projectType).toBe('web-app');
    }
  });
});

// ─── wizardSubmissionSchema ──────────────────────────────────────────────────

describe('wizardSubmissionSchema', () => {
  it('accepts valid serialised JSON selections', () => {
    const payload = { selectionsJson: JSON.stringify(VALID_SELECTIONS) };
    expect(wizardSubmissionSchema.safeParse(payload).success).toBe(true);
  });

  it('rejects non-string selectionsJson', () => {
    expect(wizardSubmissionSchema.safeParse({ selectionsJson: 123 }).success).toBe(false);
  });

  it('rejects empty selectionsJson', () => {
    expect(wizardSubmissionSchema.safeParse({ selectionsJson: '' }).success).toBe(false);
  });

  it('rejects selectionsJson that is not valid JSON', () => {
    expect(wizardSubmissionSchema.safeParse({ selectionsJson: '{not json}' }).success).toBe(false);
  });

  it('rejects selectionsJson containing invalid selections', () => {
    const bad = JSON.stringify({ ...VALID_SELECTIONS, projectType: 'invalid-type' });
    expect(wizardSubmissionSchema.safeParse({ selectionsJson: bad }).success).toBe(false);
  });

  it('parses and returns typed selections data on success', () => {
    const payload = { selectionsJson: JSON.stringify(VALID_SELECTIONS) };
    const result = wizardSubmissionSchema.safeParse(payload);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.selections.projectName).toBe('DevPrint');
      expect(result.data.selections.projectType).toBe('web-app');
    }
  });

  it('rejects selectionsJson exceeding 10 000 characters', () => {
    const oversized = JSON.stringify({ ...VALID_SELECTIONS, description: 'x'.repeat(10_000) });
    expect(wizardSubmissionSchema.safeParse({ selectionsJson: oversized }).success).toBe(false);
  });
});
