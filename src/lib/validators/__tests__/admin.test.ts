// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { reviewSubmissionSchema, technologyFormSchema, promoteUserSchema } from '../admin';

// ─── reviewSubmissionSchema ───────────────────────────────────────────────

describe('reviewSubmissionSchema', () => {
  const VALID_APPROVE = {
    contributionId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    action: 'approve' as const,
    reviewNotes: '',
  };

  it('accepts valid approve input', () => {
    expect(reviewSubmissionSchema.safeParse(VALID_APPROVE).success).toBe(true);
  });

  it('accepts valid reject input with notes', () => {
    const input = { ...VALID_APPROVE, action: 'reject' as const, reviewNotes: 'Needs more detail' };
    expect(reviewSubmissionSchema.safeParse(input).success).toBe(true);
  });

  it('defaults reviewNotes to empty string when omitted', () => {
    const { reviewNotes: _, ...rest } = VALID_APPROVE; // eslint-disable-line @typescript-eslint/no-unused-vars
    const result = reviewSubmissionSchema.safeParse(rest);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.reviewNotes).toBe('');
  });

  it('rejects non-UUID contributionId', () => {
    expect(reviewSubmissionSchema.safeParse({ ...VALID_APPROVE, contributionId: 'not-a-uuid' }).success).toBe(false);
  });

  it('rejects invalid action value', () => {
    expect(reviewSubmissionSchema.safeParse({ ...VALID_APPROVE, action: 'maybe' }).success).toBe(false);
  });

  it('rejects reviewNotes exceeding 500 chars', () => {
    expect(reviewSubmissionSchema.safeParse({ ...VALID_APPROVE, reviewNotes: 'x'.repeat(501) }).success).toBe(false);
  });
});

// ─── technologyFormSchema ─────────────────────────────────────────────────

describe('technologyFormSchema', () => {
  const VALID_TECH = {
    name: 'React',
    slug: 'react',
    category: 'library',
    description: 'A JavaScript library for building user interfaces.',
    logo_url: null,
    website_url: null,
    github_url: null,
    npm_package: null,
    github_stars: null,
    npm_weekly_downloads: null,
    pros: ['Composable', 'Large ecosystem'],
    cons: ['JSX learning curve'],
    best_for: ['Web apps', 'SPAs'],
    learning_curve: 'intermediate' as const,
    community_size: 'large' as const,
    maturity: 'mature' as const,
    metadata: {},
  };

  it('accepts a fully valid technology', () => {
    expect(technologyFormSchema.safeParse(VALID_TECH).success).toBe(true);
  });

  it('rejects empty name', () => {
    expect(technologyFormSchema.safeParse({ ...VALID_TECH, name: '' }).success).toBe(false);
  });

  it('rejects invalid slug (uppercase)', () => {
    expect(technologyFormSchema.safeParse({ ...VALID_TECH, slug: 'React-JS' }).success).toBe(false);
  });

  it('rejects invalid learning_curve value', () => {
    expect(technologyFormSchema.safeParse({ ...VALID_TECH, learning_curve: 'expert' }).success).toBe(false);
  });

  it('rejects invalid community_size value', () => {
    expect(technologyFormSchema.safeParse({ ...VALID_TECH, community_size: 'huge' }).success).toBe(false);
  });

  it('rejects invalid maturity value', () => {
    expect(technologyFormSchema.safeParse({ ...VALID_TECH, maturity: 'legacy' }).success).toBe(false);
  });

  it('rejects empty pros array', () => {
    expect(technologyFormSchema.safeParse({ ...VALID_TECH, pros: [] }).success).toBe(false);
  });

  it('rejects negative github_stars', () => {
    expect(technologyFormSchema.safeParse({ ...VALID_TECH, github_stars: -1 }).success).toBe(false);
  });

  it('accepts valid URL strings', () => {
    const result = technologyFormSchema.safeParse({
      ...VALID_TECH,
      website_url: 'https://react.dev',
      github_url: 'https://github.com/facebook/react',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid URL', () => {
    expect(technologyFormSchema.safeParse({ ...VALID_TECH, website_url: 'not-a-url' }).success).toBe(false);
  });

  it('coerces empty string URL to null', () => {
    const result = technologyFormSchema.safeParse({ ...VALID_TECH, website_url: '' });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.website_url).toBeNull();
  });

  it('defaults metadata to empty object when omitted', () => {
    const { metadata: _, ...rest } = VALID_TECH; // eslint-disable-line @typescript-eslint/no-unused-vars
    const result = technologyFormSchema.safeParse(rest);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.metadata).toEqual({});
  });

  it('coerces empty string npm_package to null', () => {
    const result = technologyFormSchema.safeParse({ ...VALID_TECH, npm_package: '' });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.npm_package).toBeNull();
  });

  it('accepts a non-empty npm_package string', () => {
    const result = technologyFormSchema.safeParse({ ...VALID_TECH, npm_package: 'react' });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.npm_package).toBe('react');
  });
});

// ─── promoteUserSchema ────────────────────────────────────────────────────

describe('promoteUserSchema', () => {
  const VALID = {
    userId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    newRole: 'contributor' as const,
  };

  it('accepts valid promote input', () => {
    expect(promoteUserSchema.safeParse(VALID).success).toBe(true);
  });

  it('rejects non-UUID userId', () => {
    expect(promoteUserSchema.safeParse({ ...VALID, userId: 'not-a-uuid' }).success).toBe(false);
  });

  it('accepts all valid roles', () => {
    for (const role of ['developer', 'contributor', 'admin'] as const) {
      expect(promoteUserSchema.safeParse({ ...VALID, newRole: role }).success).toBe(true);
    }
  });

  it('rejects invalid role', () => {
    expect(promoteUserSchema.safeParse({ ...VALID, newRole: 'superadmin' }).success).toBe(false);
  });
});
