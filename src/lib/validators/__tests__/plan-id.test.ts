// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { planIdSchema } from '../plan-id';

describe('planIdSchema', () => {
  it('accepts a valid UUID v4', () => {
    const result = planIdSchema.safeParse('550e8400-e29b-41d4-a716-446655440000');
    expect(result.success).toBe(true);
  });

  it('accepts a Supabase-generated UUID format', () => {
    const result = planIdSchema.safeParse('a1b2c3d4-e5f6-7890-abcd-ef1234567890');
    expect(result.success).toBe(true);
  });

  it('rejects an empty string', () => {
    const result = planIdSchema.safeParse('');
    expect(result.success).toBe(false);
  });

  it('rejects a plain string that is not a UUID', () => {
    const result = planIdSchema.safeParse('not-a-uuid');
    expect(result.success).toBe(false);
  });

  it('rejects undefined', () => {
    const result = planIdSchema.safeParse(undefined);
    expect(result.success).toBe(false);
  });

  it('rejects a number', () => {
    const result = planIdSchema.safeParse(12345);
    expect(result.success).toBe(false);
  });

  it('rejects a UUID with wrong segment lengths', () => {
    const result = planIdSchema.safeParse('550e8400-e29b-41d4-a716');
    expect(result.success).toBe(false);
  });

  it('returns the validated string on success', () => {
    const uuid = '550e8400-e29b-41d4-a716-446655440000';
    const result = planIdSchema.safeParse(uuid);
    if (result.success) {
      expect(result.data).toBe(uuid);
    }
  });
});
