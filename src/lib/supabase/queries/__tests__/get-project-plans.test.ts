// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';
import {
  getProjectPlansByUser,
  getProjectPlanById,
  deleteProjectPlan,
} from '../get-project-plans';

vi.mock('@/lib/supabase/server', () => ({
  createServerClient: vi.fn(),
}));

import { createServerClient } from '@/lib/supabase/server';

const MOCK_PLAN_SUMMARY = {
  id: 'plan-1',
  name: 'My App',
  description: 'A great app',
  created_at: '2026-04-01T00:00:00Z',
  updated_at: '2026-04-01T00:00:00Z',
};

const MOCK_PLAN_FULL = {
  ...MOCK_PLAN_SUMMARY,
  user_id: 'user-1',
  selections: { frontend: 'Next.js' },
  config_data: { projectName: 'My App', configs: [] },
};

function makeMockChain(resolvedValue: { data: unknown; error: unknown }) {
  const chain: Record<string, Mock> = {
    select: vi.fn(),
    eq: vi.fn(),
    order: vi.fn(),
    limit: vi.fn(),
    maybeSingle: vi.fn(),
    delete: vi.fn(),
  };
  // Every method returns the same chain object, except terminal ones
  chain.select.mockReturnValue(chain);
  chain.eq.mockReturnValue(chain);
  chain.order.mockReturnValue(chain);
  chain.delete.mockReturnValue(chain);
  chain.limit.mockResolvedValue(resolvedValue);
  chain.maybeSingle.mockResolvedValue(resolvedValue);
  return chain;
}

function makeDeleteChain(resolvedValue: { error: unknown }) {
  const chain: Record<string, Mock> = {
    delete: vi.fn(),
    eq: vi.fn(),
  };
  chain.delete.mockReturnValue(chain);
  // Each .eq() call returns the chain; after two calls the chain resolves
  let eqCount = 0;
  chain.eq.mockImplementation(() => {
    eqCount++;
    if (eqCount >= 2) {
      return Promise.resolve(resolvedValue);
    }
    return chain;
  });
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

// ─── getProjectPlansByUser ─────────────────────────────────────────────────

describe('getProjectPlansByUser', () => {
  it('returns an array of plan summaries', async () => {
    const chain = makeMockChain({ data: [MOCK_PLAN_SUMMARY], error: null });
    mockClient(chain);
    const result = await getProjectPlansByUser('user-1');
    expect(result).toEqual([MOCK_PLAN_SUMMARY]);
  });

  it('returns empty array when user has no plans', async () => {
    const chain = makeMockChain({ data: [], error: null });
    mockClient(chain);
    const result = await getProjectPlansByUser('user-1');
    expect(result).toEqual([]);
  });

  it('returns empty array (does not throw) when Supabase returns an error', async () => {
    const chain = makeMockChain({ data: null, error: { message: 'DB error' } });
    mockClient(chain);
    const result = await getProjectPlansByUser('user-1');
    expect(result).toEqual([]);
  });

  it('filters by user_id', async () => {
    const chain = makeMockChain({ data: [], error: null });
    mockClient(chain);
    await getProjectPlansByUser('user-abc');
    expect(chain.eq).toHaveBeenCalledWith('user_id', 'user-abc');
  });

  it('orders results by created_at descending', async () => {
    const chain = makeMockChain({ data: [], error: null });
    mockClient(chain);
    await getProjectPlansByUser('user-1');
    expect(chain.order).toHaveBeenCalledWith('created_at', { ascending: false });
  });

  it('applies a limit of 50', async () => {
    const chain = makeMockChain({ data: [], error: null });
    mockClient(chain);
    await getProjectPlansByUser('user-1');
    expect(chain.limit).toHaveBeenCalledWith(50);
  });

  it('selects only summary columns (no selections or config_data)', async () => {
    const chain = makeMockChain({ data: [], error: null });
    mockClient(chain);
    await getProjectPlansByUser('user-1');
    const selectedCols: string = chain.select.mock.calls[0][0];
    expect(selectedCols).toContain('id');
    expect(selectedCols).toContain('name');
    expect(selectedCols).toContain('description');
    expect(selectedCols).toContain('created_at');
    expect(selectedCols).not.toContain('selections');
    expect(selectedCols).not.toContain('config_data');
  });
});

// ─── getProjectPlanById ───────────────────────────────────────────────────

describe('getProjectPlanById', () => {
  it('returns the plan when it exists and belongs to the user', async () => {
    const chain = makeMockChain({ data: MOCK_PLAN_FULL, error: null });
    mockClient(chain);
    const result = await getProjectPlanById('plan-1', 'user-1');
    expect(result).toEqual(MOCK_PLAN_FULL);
  });

  it('returns null when plan does not exist', async () => {
    const chain = makeMockChain({ data: null, error: null });
    mockClient(chain);
    const result = await getProjectPlanById('nonexistent', 'user-1');
    expect(result).toBeNull();
  });

  it('returns null (does not throw) when Supabase returns an error', async () => {
    const chain = makeMockChain({ data: null, error: { message: 'not found' } });
    mockClient(chain);
    const result = await getProjectPlanById('plan-1', 'user-1');
    expect(result).toBeNull();
  });

  it('filters by both plan id and user_id (ownership)', async () => {
    const chain = makeMockChain({ data: MOCK_PLAN_FULL, error: null });
    mockClient(chain);
    await getProjectPlanById('plan-1', 'user-1');
    const eqCalls = chain.eq.mock.calls;
    expect(eqCalls).toContainEqual(['id', 'plan-1']);
    expect(eqCalls).toContainEqual(['user_id', 'user-1']);
  });

  it('returns full plan including selections and config_data', async () => {
    const chain = makeMockChain({ data: MOCK_PLAN_FULL, error: null });
    mockClient(chain);
    const result = await getProjectPlanById('plan-1', 'user-1');
    expect(result?.selections).toBeDefined();
    expect(result?.config_data).toBeDefined();
  });

  it('includes all columns in select', async () => {
    const chain = makeMockChain({ data: MOCK_PLAN_FULL, error: null });
    mockClient(chain);
    await getProjectPlanById('plan-1', 'user-1');
    const selectedCols: string = chain.select.mock.calls[0][0];
    expect(selectedCols).toContain('selections');
    expect(selectedCols).toContain('config_data');
    expect(selectedCols).toContain('user_id');
  });
});

// ─── deleteProjectPlan ────────────────────────────────────────────────────

describe('deleteProjectPlan', () => {
  it('returns success: true when deletion succeeds', async () => {
    const chain = makeDeleteChain({ error: null });
    mockClient(chain);
    const result = await deleteProjectPlan('plan-1', 'user-1');
    expect(result).toEqual({ success: true });
  });

  it('returns success: false with error message on Supabase error', async () => {
    const chain = makeDeleteChain({ error: { message: 'delete failed' } });
    mockClient(chain);
    const result = await deleteProjectPlan('plan-1', 'user-1');
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('does not throw on error', async () => {
    const chain = makeDeleteChain({ error: { message: 'db error' } });
    mockClient(chain);
    await expect(deleteProjectPlan('plan-1', 'user-1')).resolves.not.toThrow();
  });

  it('filters by both plan id and user_id', async () => {
    const chain = makeDeleteChain({ error: null });
    mockClient(chain);
    await deleteProjectPlan('plan-1', 'user-1');
    const eqCalls = chain.eq.mock.calls;
    expect(eqCalls).toContainEqual(['id', 'plan-1']);
    expect(eqCalls).toContainEqual(['user_id', 'user-1']);
  });
});
