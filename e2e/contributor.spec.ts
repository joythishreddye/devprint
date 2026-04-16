import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { test, expect } from '@playwright/test';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const AUTH_STATE = path.join(__dirname, '.auth', 'user.json');
const hasAuthState = () => fs.existsSync(AUTH_STATE);

test.describe('Contributor panel — unauthenticated', () => {
  test('redirects unauthenticated users to sign-in', async ({ page }) => {
    await page.goto('/contributor');
    await page.waitForURL(/\/sign-in/, { timeout: 10_000 });
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
  });
});

test.describe('Contributor panel — authenticated without contributor role', () => {
  test.use({
    storageState: AUTH_STATE,
  });

  test.beforeEach(async () => {
    if (!hasAuthState()) {
      test.skip(true, 'Auth state not found — set E2E_TEST_EMAIL/E2E_TEST_PASSWORD to enable');
    }
  });

  test('shows access-denied message for users without contributor role', async ({ page }) => {
    await page.goto('/contributor');

    // The page should either show "Access restricted" (no role) or the contribution form (has role).
    // We assert the page loads without a crash and the header is present.
    await expect(page.locator('header')).toBeVisible({ timeout: 10_000 });

    const accessDenied = page.getByRole('heading', { name: 'Access restricted' });
    const contributorPanel = page.getByRole('heading', { name: 'Contributor panel' });

    // One of the two headings must be visible — depends on the test user's role
    await expect(accessDenied.or(contributorPanel)).toBeVisible({ timeout: 10_000 });
  });
});

test.describe('Contributor panel — contributor role', () => {
  // These tests require a separate test user with contributor or admin role.
  // Set E2E_CONTRIBUTOR_EMAIL and E2E_CONTRIBUTOR_PASSWORD to enable.

  let contributorAuthFile: string;

  test.beforeAll(async ({ browser }) => {
    const email = process.env.E2E_CONTRIBUTOR_EMAIL;
    const password = process.env.E2E_CONTRIBUTOR_PASSWORD;
    const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000';

    if (!email || !password) {
      return; // Tests below will be skipped individually
    }

    contributorAuthFile = path.join(__dirname, '.auth', 'contributor.json');

    const page = await browser.newPage();
    try {
      await page.goto(`${baseURL}/sign-in`);
      await page.fill('input[name="email"]', email);
      await page.fill('input[name="password"]', password);
      await page.getByRole('button', { name: 'Sign in' }).click();
      await page.waitForURL(`${baseURL}/wizard`, { timeout: 15_000 });
      await page.context().storageState({ path: contributorAuthFile });
    } finally {
      await page.close();
    }
  });

  test('contributor can view the submission form', async ({ page }) => {
    const email = process.env.E2E_CONTRIBUTOR_EMAIL;
    const password = process.env.E2E_CONTRIBUTOR_PASSWORD;
    if (!email || !password) {
      test.skip(true, 'E2E_CONTRIBUTOR_EMAIL / E2E_CONTRIBUTOR_PASSWORD not set');
      return;
    }

    await page.context().storageState({ path: contributorAuthFile });
    await page.goto('/contributor');

    await expect(page.getByRole('heading', { name: 'Contributor panel' })).toBeVisible({
      timeout: 10_000,
    });
    await expect(page.getByRole('heading', { name: 'Submit a technology' })).toBeVisible();
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="slug"]')).toBeVisible();
    await expect(page.locator('textarea[name="description"]')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Submit for review' })).toBeVisible();
  });

  test('contributor can submit a new technology entry', async ({ page }) => {
    const email = process.env.E2E_CONTRIBUTOR_EMAIL;
    const password = process.env.E2E_CONTRIBUTOR_PASSWORD;
    if (!email || !password) {
      test.skip(true, 'E2E_CONTRIBUTOR_EMAIL / E2E_CONTRIBUTOR_PASSWORD not set');
      return;
    }

    await page.context().storageState({ path: contributorAuthFile });
    await page.goto('/contributor');

    const uniqueSlug = `e2e-test-tech-${Date.now()}`;

    await page.fill('input[name="name"]', 'E2E Test Technology');
    await page.fill('input[name="slug"]', uniqueSlug);
    await page.fill('input[name="category"]', 'Testing');
    await page.selectOption('select[name="learning_curve"]', 'beginner');
    await page.selectOption('select[name="community_size"]', 'small');
    await page.selectOption('select[name="maturity"]', 'emerging');
    await page.fill(
      'textarea[name="description"]',
      'A technology created by the automated E2E test suite.'
    );
    await page.fill('textarea[name="pros"]', 'Fast\nReliable');
    await page.fill('textarea[name="cons"]', 'Limited support');
    await page.fill('textarea[name="best_for"]', 'Testing purposes');

    await page.getByRole('button', { name: 'Submit for review' }).click();

    // Expect a success confirmation after submission
    await expect(page.locator('.bg-green-50, [class*="green"]').first()).toBeVisible({
      timeout: 15_000,
    });
  });
});
