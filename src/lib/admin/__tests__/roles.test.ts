// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { isPromotion, canPromoteTo } from '../roles';

describe('isPromotion', () => {
  it('developer → contributor is a promotion', () => {
    expect(isPromotion('developer', 'contributor')).toBe(true);
  });

  it('developer → admin is a promotion', () => {
    expect(isPromotion('developer', 'admin')).toBe(true);
  });

  it('contributor → admin is a promotion', () => {
    expect(isPromotion('contributor', 'admin')).toBe(true);
  });

  it('admin → developer is NOT a promotion (demotion)', () => {
    expect(isPromotion('admin', 'developer')).toBe(false);
  });

  it('admin → contributor is NOT a promotion (demotion)', () => {
    expect(isPromotion('admin', 'contributor')).toBe(false);
  });

  it('contributor → developer is NOT a promotion (demotion)', () => {
    expect(isPromotion('contributor', 'developer')).toBe(false);
  });

  it('same role is NOT a promotion', () => {
    expect(isPromotion('developer', 'developer')).toBe(false);
    expect(isPromotion('contributor', 'contributor')).toBe(false);
    expect(isPromotion('admin', 'admin')).toBe(false);
  });
});

describe('canPromoteTo', () => {
  it('developer can be promoted to contributor or admin', () => {
    const targets = canPromoteTo('developer');
    expect(targets).toContain('contributor');
    expect(targets).toContain('admin');
    expect(targets).not.toContain('developer');
  });

  it('contributor can be promoted to admin only', () => {
    const targets = canPromoteTo('contributor');
    expect(targets).toEqual(['admin']);
  });

  it('admin cannot be promoted (already top role)', () => {
    const targets = canPromoteTo('admin');
    expect(targets).toEqual([]);
  });
});
