// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { technologiesQuerySchema, technologySlugSchema, compareQuerySchema } from '../api-params';

// ─── technologiesQuerySchema ──────────────────────────────────────────────

describe('technologiesQuerySchema', () => {
  it('accepts no category (all optional)', () => {
    expect(technologiesQuerySchema.safeParse({}).success).toBe(true);
  });

  it('accepts a valid category string', () => {
    const result = technologiesQuerySchema.safeParse({ category: 'framework' });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.category).toBe('framework');
  });

  it('rejects empty string category', () => {
    expect(technologiesQuerySchema.safeParse({ category: '' }).success).toBe(false);
  });

  it('rejects category exceeding 50 chars', () => {
    expect(technologiesQuerySchema.safeParse({ category: 'a'.repeat(51) }).success).toBe(false);
  });
});

// ─── technologySlugSchema ─────────────────────────────────────────────────

describe('technologySlugSchema', () => {
  it('accepts a valid slug', () => {
    expect(technologySlugSchema.safeParse({ slug: 'next-js' }).success).toBe(true);
  });

  it('accepts single-word slug', () => {
    expect(technologySlugSchema.safeParse({ slug: 'react' }).success).toBe(true);
  });

  it('rejects empty slug', () => {
    expect(technologySlugSchema.safeParse({ slug: '' }).success).toBe(false);
  });

  it('rejects slug exceeding 100 chars', () => {
    expect(technologySlugSchema.safeParse({ slug: 'a-'.repeat(51) }).success).toBe(false);
  });

  it('rejects slug with uppercase letters', () => {
    expect(technologySlugSchema.safeParse({ slug: 'Next-JS' }).success).toBe(false);
  });

  it('rejects slug with spaces', () => {
    expect(technologySlugSchema.safeParse({ slug: 'next js' }).success).toBe(false);
  });

  it('rejects slug with special characters', () => {
    expect(technologySlugSchema.safeParse({ slug: 'next.js' }).success).toBe(false);
  });
});

// ─── compareQuerySchema ───────────────────────────────────────────────────

describe('compareQuerySchema', () => {
  it('accepts a valid slug pair', () => {
    const result = compareQuerySchema.safeParse({ a: 'react', b: 'vue' });
    expect(result.success).toBe(true);
  });

  it('rejects when a === b (same slug)', () => {
    expect(compareQuerySchema.safeParse({ a: 'react', b: 'react' }).success).toBe(false);
  });

  it('rejects missing a param', () => {
    expect(compareQuerySchema.safeParse({ b: 'vue' }).success).toBe(false);
  });

  it('rejects missing b param', () => {
    expect(compareQuerySchema.safeParse({ a: 'react' }).success).toBe(false);
  });

  it('rejects invalid a slug (uppercase)', () => {
    expect(compareQuerySchema.safeParse({ a: 'React', b: 'vue' }).success).toBe(false);
  });

  it('rejects invalid b slug (spaces)', () => {
    expect(compareQuerySchema.safeParse({ a: 'react', b: 'vue js' }).success).toBe(false);
  });

  it('rejects empty a slug', () => {
    expect(compareQuerySchema.safeParse({ a: '', b: 'vue' }).success).toBe(false);
  });
});
