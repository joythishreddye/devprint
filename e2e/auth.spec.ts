import { test, expect } from '@playwright/test';

// Auth tests use fresh browser contexts — NOT the shared storageState —
// so sign-in/sign-out actions don't corrupt other test runs.

test.describe('Sign-up flow', () => {
  test('renders sign-up form with all fields', async ({ page }) => {
    await page.goto('/sign-up');

    await expect(page.getByRole('heading', { name: 'Create an account' })).toBeVisible();
    await expect(page.locator('input[name="display_name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Create account' })).toBeVisible();
  });

  test('shows field validation errors for empty submission', async ({ page }) => {
    await page.goto('/sign-up');

    // Use a syntactically valid email so the browser does not block submission
    // with its native validation UI. The password is too short for Zod (min 8),
    // so the server action returns a fieldError we can assert on.
    await page.fill('input[name="display_name"]', 'Test User');
    await page.fill('input[name="email"]', 'valid@example.com');
    await page.fill('input[name="password"]', 'short');
    await page.getByRole('button', { name: 'Create account' }).click();

    // Wait for the Zod field error returned by the server action
    await expect(page.locator('p.text-red-600').first()).toBeVisible({ timeout: 10_000 });
  });

  test('submitting valid new email reaches a valid post-sign-up state', async ({ page }) => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      test.skip(true, 'Supabase env not configured — skipping live sign-up test');
      return;
    }

    await page.goto('/sign-up');

    const uniqueEmail = `e2e+${Date.now()}@devprint-test.com`;
    await page.fill('input[name="display_name"]', 'E2E Test User');
    await page.fill('input[name="email"]', uniqueEmail);
    await page.fill('input[name="password"]', 'testpassword123');
    await page.getByRole('button', { name: 'Create account' }).click();

    // Two valid outcomes depending on the Supabase project's email-confirmation setting:
    //   1. Confirmation required  → stays on /sign-up showing "Check your email" heading
    //   2. Auto-confirmed         → redirects to /wizard (session returned immediately)
    // We wait for whichever arrives first, then assert the outcome is valid.
    await Promise.race([
      page
        .getByRole('heading', { name: 'Check your email' })
        .waitFor({ state: 'visible', timeout: 15_000 }),
      page.waitForURL('**/wizard', { timeout: 15_000 }),
    ]);

    const currentUrl = page.url();

    if (currentUrl.includes('/wizard')) {
      // Auto-confirmed path: landed on wizard, sign-up succeeded
      await expect(page).toHaveURL(/\/wizard/);
    } else {
      // Email-confirmation path: confirmation page shown
      await expect(page.getByRole('heading', { name: 'Check your email' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Back to sign in' })).toBeVisible();
    }
  });
});

test.describe('Sign-in flow', () => {
  test('renders sign-in form', async ({ page }) => {
    await page.goto('/sign-in');

    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
  });

  test('shows error message for invalid credentials', async ({ page }) => {
    await page.goto('/sign-in');

    await page.fill('input[name="email"]', 'nobody@example.com');
    await page.fill('input[name="password"]', 'wrongpassword123');
    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(page.locator('.bg-red-50').first()).toBeVisible({ timeout: 10_000 });
  });

  test('sign in and sign out with valid credentials', async ({ page }) => {
    const email = process.env.E2E_TEST_EMAIL;
    const password = process.env.E2E_TEST_PASSWORD;

    if (!email || !password) {
      test.skip(true, 'E2E_TEST_EMAIL / E2E_TEST_PASSWORD not set');
      return;
    }

    // Sign in
    await page.goto('/sign-in');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.getByRole('button', { name: 'Sign in' }).click();
    await page.waitForURL('/wizard', { timeout: 15_000 });

    // Authenticated nav items are visible
    await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign out' })).toBeVisible();

    // Sign out
    await page.getByRole('button', { name: 'Sign out' }).click();
    await page.waitForURL('/sign-in', { timeout: 10_000 });

    // Back to unauthenticated state
    await expect(page.getByRole('link', { name: 'Sign in' })).toBeVisible();
  });
});
