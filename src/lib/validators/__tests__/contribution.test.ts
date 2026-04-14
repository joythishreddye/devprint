// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { technologySubmissionSchema } from '../contribution';

const VALID_INPUT = {
  name: 'Next.js',
  slug: 'next-js',
  category: 'framework',
  description: 'The React framework for production.',
  logo_url: null,
  website_url: null,
  github_url: null,
  npm_package: null,
  github_stars: null,
  npm_weekly_downloads: null,
  pros: ['Great DX', 'SSR support'],
  cons: ['Learning curve'],
  best_for: ['Web apps'],
  learning_curve: 'intermediate' as const,
  community_size: 'large' as const,
  maturity: 'mature' as const,
  metadata: {},
};

describe('technologySubmissionSchema', () => {
  // ─── Happy path ───────────────────────────────────────────────────────────

  it('accepts a fully valid input', () => {
    const result = technologySubmissionSchema.safeParse(VALID_INPUT);
    expect(result.success).toBe(true);
  });

  it('accepts valid URL strings for optional URL fields', () => {
    const input = {
      ...VALID_INPUT,
      logo_url: 'https://example.com/logo.png',
      website_url: 'https://example.com',
      github_url: 'https://github.com/example/repo',
    };
    const result = technologySubmissionSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it('accepts positive integers for github_stars and npm_weekly_downloads', () => {
    const input = { ...VALID_INPUT, github_stars: 5000, npm_weekly_downloads: 1_000_000 };
    const result = technologySubmissionSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it('accepts all valid learning_curve values', () => {
    for (const lc of ['beginner', 'intermediate', 'advanced'] as const) {
      const result = technologySubmissionSchema.safeParse({ ...VALID_INPUT, learning_curve: lc });
      expect(result.success).toBe(true);
    }
  });

  it('accepts all valid community_size values', () => {
    for (const cs of ['small', 'medium', 'large'] as const) {
      const result = technologySubmissionSchema.safeParse({ ...VALID_INPUT, community_size: cs });
      expect(result.success).toBe(true);
    }
  });

  it('accepts all valid maturity values', () => {
    for (const m of ['emerging', 'growing', 'mature', 'declining'] as const) {
      const result = technologySubmissionSchema.safeParse({ ...VALID_INPUT, maturity: m });
      expect(result.success).toBe(true);
    }
  });

  // ─── Required fields ─────────────────────────────────────────────────────

  it('rejects missing name', () => {
    const omit = ({ name: _, ...r }: typeof VALID_INPUT) => r; // eslint-disable-line @typescript-eslint/no-unused-vars
    const result = technologySubmissionSchema.safeParse(omit(VALID_INPUT));
    expect(result.success).toBe(false);
  });

  it('rejects missing slug', () => {
    const omit = ({ slug: _, ...r }: typeof VALID_INPUT) => r; // eslint-disable-line @typescript-eslint/no-unused-vars
    const result = technologySubmissionSchema.safeParse(omit(VALID_INPUT));
    expect(result.success).toBe(false);
  });

  it('rejects missing category', () => {
    const omit = ({ category: _, ...r }: typeof VALID_INPUT) => r; // eslint-disable-line @typescript-eslint/no-unused-vars
    const result = technologySubmissionSchema.safeParse(omit(VALID_INPUT));
    expect(result.success).toBe(false);
  });

  it('rejects missing description', () => {
    const omit = ({ description: _, ...r }: typeof VALID_INPUT) => r; // eslint-disable-line @typescript-eslint/no-unused-vars
    const result = technologySubmissionSchema.safeParse(omit(VALID_INPUT));
    expect(result.success).toBe(false);
  });

  // ─── String length constraints ────────────────────────────────────────────

  it('rejects empty name', () => {
    const result = technologySubmissionSchema.safeParse({ ...VALID_INPUT, name: '' });
    expect(result.success).toBe(false);
  });

  it('rejects name exceeding 100 chars', () => {
    const result = technologySubmissionSchema.safeParse({ ...VALID_INPUT, name: 'a'.repeat(101) });
    expect(result.success).toBe(false);
  });

  it('rejects empty slug', () => {
    const result = technologySubmissionSchema.safeParse({ ...VALID_INPUT, slug: '' });
    expect(result.success).toBe(false);
  });

  it('rejects slug exceeding 100 chars', () => {
    const result = technologySubmissionSchema.safeParse({ ...VALID_INPUT, slug: 'a-'.repeat(51) });
    expect(result.success).toBe(false);
  });

  it('rejects slug with uppercase letters', () => {
    const result = technologySubmissionSchema.safeParse({ ...VALID_INPUT, slug: 'Next-JS' });
    expect(result.success).toBe(false);
  });

  it('rejects slug with spaces', () => {
    const result = technologySubmissionSchema.safeParse({ ...VALID_INPUT, slug: 'next js' });
    expect(result.success).toBe(false);
  });

  it('rejects empty description', () => {
    const result = technologySubmissionSchema.safeParse({ ...VALID_INPUT, description: '' });
    expect(result.success).toBe(false);
  });

  it('rejects description exceeding 2000 chars', () => {
    const result = technologySubmissionSchema.safeParse({ ...VALID_INPUT, description: 'x'.repeat(2001) });
    expect(result.success).toBe(false);
  });

  // ─── URL validation ───────────────────────────────────────────────────────

  it('rejects invalid logo_url string', () => {
    const result = technologySubmissionSchema.safeParse({ ...VALID_INPUT, logo_url: 'not-a-url' });
    expect(result.success).toBe(false);
  });

  it('rejects invalid website_url string', () => {
    const result = technologySubmissionSchema.safeParse({ ...VALID_INPUT, website_url: 'not-a-url' });
    expect(result.success).toBe(false);
  });

  it('rejects invalid github_url string', () => {
    const result = technologySubmissionSchema.safeParse({ ...VALID_INPUT, github_url: 'not-a-url' });
    expect(result.success).toBe(false);
  });

  // ─── Numeric constraints ──────────────────────────────────────────────────

  it('rejects negative github_stars', () => {
    const result = technologySubmissionSchema.safeParse({ ...VALID_INPUT, github_stars: -1 });
    expect(result.success).toBe(false);
  });

  it('rejects negative npm_weekly_downloads', () => {
    const result = technologySubmissionSchema.safeParse({ ...VALID_INPUT, npm_weekly_downloads: -1 });
    expect(result.success).toBe(false);
  });

  it('rejects non-integer github_stars', () => {
    const result = technologySubmissionSchema.safeParse({ ...VALID_INPUT, github_stars: 1.5 });
    expect(result.success).toBe(false);
  });

  // ─── Array constraints ────────────────────────────────────────────────────

  it('rejects empty pros array', () => {
    const result = technologySubmissionSchema.safeParse({ ...VALID_INPUT, pros: [] });
    expect(result.success).toBe(false);
  });

  it('rejects pros array with more than 10 items', () => {
    const result = technologySubmissionSchema.safeParse({ ...VALID_INPUT, pros: Array(11).fill('good') });
    expect(result.success).toBe(false);
  });

  it('rejects pros item exceeding 200 chars', () => {
    const result = technologySubmissionSchema.safeParse({ ...VALID_INPUT, pros: ['x'.repeat(201)] });
    expect(result.success).toBe(false);
  });

  it('rejects empty cons array', () => {
    const result = technologySubmissionSchema.safeParse({ ...VALID_INPUT, cons: [] });
    expect(result.success).toBe(false);
  });

  it('rejects empty best_for array', () => {
    const result = technologySubmissionSchema.safeParse({ ...VALID_INPUT, best_for: [] });
    expect(result.success).toBe(false);
  });

  // ─── Enum validation ─────────────────────────────────────────────────────

  it('rejects invalid learning_curve value', () => {
    const result = technologySubmissionSchema.safeParse({ ...VALID_INPUT, learning_curve: 'expert' });
    expect(result.success).toBe(false);
  });

  it('rejects invalid community_size value', () => {
    const result = technologySubmissionSchema.safeParse({ ...VALID_INPUT, community_size: 'huge' });
    expect(result.success).toBe(false);
  });

  it('rejects invalid maturity value', () => {
    const result = technologySubmissionSchema.safeParse({ ...VALID_INPUT, maturity: 'legacy' });
    expect(result.success).toBe(false);
  });

  // ─── Null normalization ───────────────────────────────────────────────────

  it('coerces empty string logo_url to null', () => {
    const result = technologySubmissionSchema.safeParse({ ...VALID_INPUT, logo_url: '' });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.logo_url).toBeNull();
  });

  it('coerces empty string website_url to null', () => {
    const result = technologySubmissionSchema.safeParse({ ...VALID_INPUT, website_url: '' });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.website_url).toBeNull();
  });

  it('coerces empty string npm_package to null', () => {
    const result = technologySubmissionSchema.safeParse({ ...VALID_INPUT, npm_package: '' });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.npm_package).toBeNull();
  });

  // ─── metadata ────────────────────────────────────────────────────────────

  it('defaults metadata to empty object when not provided', () => {
    const omit = ({ metadata: _, ...r }: typeof VALID_INPUT) => r; // eslint-disable-line @typescript-eslint/no-unused-vars
    const result = technologySubmissionSchema.safeParse(omit(VALID_INPUT));
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.metadata).toEqual({});
  });
});
