// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';
import {
  getUserContributions,
  getContributionById,
  submitContribution,
  deleteContribution,
  getUserRole,
} from '../contributions';

vi.mock('@/lib/supabase/server', () => ({
  createServerClient: vi.fn(),
}));

import { createServerClient } from '@/lib/supabase/server';

const MOCK_CONTRIBUTION = {
  id: 'contrib-1',
  contributor_id: 'user-1',
  technology_data: { name: 'React', slug: 'react' },
  status: 'pending' as const,
  reviewer_id: null,
  review_notes: null,
  created_at: '2026-04-01T00:00:00Z',
  updated_at: '2026-04-01T00:00:00Z',
};

function makeListChain(resolvedValue: { data: unknown; error: unknown }) {
  const chain: Record<string, Mock> = {
    select: vi.fn(),
    eq: vi.fn(),
    order: vi.fn(),
    limit: vi.fn(),
    maybeSingle: vi.fn(),
  };
  chain.select.mockReturnValue(chain);
  chain.eq.mockReturnValue(chain);
  chain.order.mockReturnValue(chain);
  chain.limit.mockResolvedValue(resolvedValue);
  chain.maybeSingle.mockResolvedValue(resolvedValue);
  return chain;
}

function makeInsertChain(resolvedValue: { data: unknown; error: unknown }) {
  const chain: Record<string, Mock> = {
    insert: vi.fn(),
    select: vi.fn(),
    single: vi.fn(),
  };
  chain.insert.mockReturnValue(chain);
  chain.select.mockReturnValue(chain);
  chain.single.mockResolvedValue(resolvedValue);
  return chain;
}

function makeDeleteChain(resolvedValue: { data: unknown; error: unknown }) {
  const chain: Record<string, Mock> = {
    delete: vi.fn(),
    eq: vi.fn(),
    select: vi.fn(),
  };
  chain.delete.mockReturnValue(chain);
  chain.eq.mockReturnValue(chain);
  chain.select.mockResolvedValue(resolvedValue);
  return chain;
}

function mockClient(queryChain: Record<string, Mock>) {
  (createServerClient as Mock).mockResolvedValue({
    from: vi.fn().mockReturnValue(queryChain),
  });
}

beforeEach(() => {
  vi.clearAllMocks();
});

// ─── getUserContributions ─────────────────────────────────────────────────

describe('getUserContributions', () => {
  it('returns a list of contributions for the user', async () => {
    const chain = makeListChain({ data: [MOCK_CONTRIBUTION], error: null });
    mockClient(chain);
    const result = await getUserContributions('user-1');
    expect(result).toEqual([MOCK_CONTRIBUTION]);
  });

  it('returns empty array when user has no contributions', async () => {
    const chain = makeListChain({ data: [], error: null });
    mockClient(chain);
    const result = await getUserContributions('user-1');
    expect(result).toEqual([]);
  });

  it('returns empty array (does not throw) on error', async () => {
    const chain = makeListChain({ data: null, error: { message: 'DB error' } });
    mockClient(chain);
    const result = await getUserContributions('user-1');
    expect(result).toEqual([]);
  });

  it('filters by contributor_id', async () => {
    const chain = makeListChain({ data: [], error: null });
    mockClient(chain);
    await getUserContributions('user-abc');
    expect(chain.eq).toHaveBeenCalledWith('contributor_id', 'user-abc');
  });

  it('orders by created_at descending', async () => {
    const chain = makeListChain({ data: [], error: null });
    mockClient(chain);
    await getUserContributions('user-1');
    expect(chain.order).toHaveBeenCalledWith('created_at', { ascending: false });
  });

  it('applies a limit of 50', async () => {
    const chain = makeListChain({ data: [], error: null });
    mockClient(chain);
    await getUserContributions('user-1');
    expect(chain.limit).toHaveBeenCalledWith(50);
  });
});

// ─── getContributionById ──────────────────────────────────────────────────

describe('getContributionById', () => {
  it('returns the contribution when it exists', async () => {
    const chain = makeListChain({ data: MOCK_CONTRIBUTION, error: null });
    mockClient(chain);
    const result = await getContributionById('contrib-1', 'user-1');
    expect(result).toEqual(MOCK_CONTRIBUTION);
  });

  it('returns null when contribution does not exist', async () => {
    const chain = makeListChain({ data: null, error: null });
    mockClient(chain);
    const result = await getContributionById('nonexistent', 'user-1');
    expect(result).toBeNull();
  });

  it('returns null on error', async () => {
    const chain = makeListChain({ data: null, error: { message: 'not found' } });
    mockClient(chain);
    const result = await getContributionById('contrib-1', 'user-1');
    expect(result).toBeNull();
  });

  it('filters by both id and contributor_id (ownership)', async () => {
    const chain = makeListChain({ data: MOCK_CONTRIBUTION, error: null });
    mockClient(chain);
    await getContributionById('contrib-1', 'user-1');
    const eqCalls = chain.eq.mock.calls;
    expect(eqCalls).toContainEqual(['id', 'contrib-1']);
    expect(eqCalls).toContainEqual(['contributor_id', 'user-1']);
  });
});

// ─── submitContribution ───────────────────────────────────────────────────

describe('submitContribution', () => {
  it('returns success: true with the created contribution', async () => {
    const chain = makeInsertChain({ data: MOCK_CONTRIBUTION, error: null });
    mockClient(chain);
    const result = await submitContribution('user-1', { name: 'React' });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toEqual(MOCK_CONTRIBUTION);
  });

  it('returns success: false with error message on DB error', async () => {
    const chain = makeInsertChain({ data: null, error: { message: 'insert failed' } });
    mockClient(chain);
    const result = await submitContribution('user-1', { name: 'React' });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBeDefined();
  });

  it('inserts with contributor_id and status pending', async () => {
    const chain = makeInsertChain({ data: MOCK_CONTRIBUTION, error: null });
    mockClient(chain);
    await submitContribution('user-1', { name: 'React' });
    expect(chain.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        contributor_id: 'user-1',
        status: 'pending',
      }),
    );
  });

  it('does not throw on error', async () => {
    const chain = makeInsertChain({ data: null, error: { message: 'error' } });
    mockClient(chain);
    await expect(submitContribution('user-1', {})).resolves.not.toThrow();
  });
});

// ─── deleteContribution ───────────────────────────────────────────────────

describe('deleteContribution', () => {
  it('returns success: true when deletion succeeds', async () => {
    const chain = makeDeleteChain({ data: [{ id: 'contrib-1' }], error: null });
    mockClient(chain);
    const result = await deleteContribution('contrib-1', 'user-1');
    expect(result.success).toBe(true);
  });

  it('returns success: false on DB error', async () => {
    const chain = makeDeleteChain({ data: null, error: { message: 'delete failed' } });
    mockClient(chain);
    const result = await deleteContribution('contrib-1', 'user-1');
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBeDefined();
  });

  it('returns success: false when no rows deleted (not found)', async () => {
    const chain = makeDeleteChain({ data: [], error: null });
    mockClient(chain);
    const result = await deleteContribution('contrib-1', 'user-1');
    expect(result.success).toBe(false);
  });

  it('filters by both id and contributor_id', async () => {
    const chain = makeDeleteChain({ data: [{ id: 'contrib-1' }], error: null });
    mockClient(chain);
    await deleteContribution('contrib-1', 'user-1');
    const eqCalls = chain.eq.mock.calls;
    expect(eqCalls).toContainEqual(['id', 'contrib-1']);
    expect(eqCalls).toContainEqual(['contributor_id', 'user-1']);
  });

  it('does not throw on error', async () => {
    const chain = makeDeleteChain({ data: null, error: { message: 'error' } });
    mockClient(chain);
    await expect(deleteContribution('contrib-1', 'user-1')).resolves.not.toThrow();
  });
});

// ─── getUserRole ──────────────────────────────────────────────────────────

describe('getUserRole', () => {
  it('returns the role for an existing user', async () => {
    const chain = makeListChain({ data: { role: 'contributor' }, error: null });
    mockClient(chain);
    const result = await getUserRole('user-1');
    expect(result).toBe('contributor');
  });

  it('returns null when user profile does not exist', async () => {
    const chain = makeListChain({ data: null, error: null });
    mockClient(chain);
    const result = await getUserRole('user-1');
    expect(result).toBeNull();
  });

  it('returns null on DB error', async () => {
    const chain = makeListChain({ data: null, error: { message: 'not found' } });
    mockClient(chain);
    const result = await getUserRole('user-1');
    expect(result).toBeNull();
  });

  it('filters by user id', async () => {
    const chain = makeListChain({ data: { role: 'admin' }, error: null });
    mockClient(chain);
    await getUserRole('user-abc');
    expect(chain.eq).toHaveBeenCalledWith('id', 'user-abc');
  });
});
