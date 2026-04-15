import * as fs from 'fs';
import * as path from 'path';
import { test, expect } from '@playwright/test';

const AUTH_STATE = path.join(__dirname, '.auth', 'user.json');
const hasAuthState = () => fs.existsSync(AUTH_STATE);

// One selection per wizard step, in order.
const WIZARD_SELECTIONS = [
  'Web Application',   // Project Type
  'Monolith',          // Architecture
  'Next.js',           // Frontend Framework
  'Tailwind CSS',      // Styling
  'Node.js',           // Backend
  'PostgreSQL',        // Database
  'Supabase Auth',     // Auth Strategy
  'Vercel',            // Hosting
  'GitHub Actions',    // CI/CD
  'Vitest',            // Testing
];

test.describe('Wizard flow', () => {
  test.beforeEach(async ({ page }) => {
    if (!hasAuthState()) {
      test.skip(true, 'Auth state not found — set E2E_TEST_EMAIL/E2E_TEST_PASSWORD to enable');
      return;
    }
    // Load stored auth state so wizard (protected route) is accessible
    await page.context().addInitScript(() => {}); // no-op; storageState loaded via fixture below
  });

  test('unauthenticated user is redirected to sign-in', async ({ page }) => {
    await page.goto('/wizard');
    await page.waitForURL(/\/sign-in/, { timeout: 10_000 });
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
  });
});

// Tests that need auth run in a separate describe that loads storageState.
test.describe('Wizard flow — authenticated', () => {
  test.use({
    storageState: AUTH_STATE,
  });

  test.beforeEach(async () => {
    if (!hasAuthState()) {
      test.skip(true, 'Auth state not found — set E2E_TEST_EMAIL/E2E_TEST_PASSWORD to enable');
    }
  });

  test('renders project-info phase on /wizard', async ({ page }) => {
    await page.goto('/wizard');

    await expect(page.getByRole('heading', { name: 'Plan your project' })).toBeVisible({
      timeout: 10_000,
    });
    await expect(page.locator('#project-name')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Start planning' })).toBeVisible();
  });

  test('"Start planning" button is disabled until project name is entered', async ({ page }) => {
    await page.goto('/wizard');

    const startBtn = page.getByRole('button', { name: 'Start planning' });
    await expect(startBtn).toBeDisabled();

    await page.fill('#project-name', 'My E2E Project');
    await expect(startBtn).toBeEnabled();
  });

  test('complete all wizard steps and generate config files', async ({ page }) => {
    await page.goto('/wizard');

    // Phase 1: Project info
    await page.fill('#project-name', 'E2E Test Plan');
    await page.fill('#project-description', 'Automated end-to-end test plan');
    await page.getByRole('button', { name: 'Start planning' }).click();

    // Phase 2: Step through all selections
    for (const optionName of WIZARD_SELECTIONS) {
      // Wait for an option card with this name to appear
      const optionCard = page.getByRole('button', { name: optionName, exact: true });
      await expect(optionCard).toBeVisible({ timeout: 10_000 });
      await optionCard.click();

      // "Next" or "Review Selections" appears once an option is selected
      const nextBtn = page.getByRole('button', { name: /^(Next|Review Selections)$/ });
      await expect(nextBtn).toBeEnabled({ timeout: 5_000 });
      await nextBtn.click();
    }

    // Phase 3: Summary page
    await expect(page.getByRole('heading', { name: 'Review your selections' })).toBeVisible({
      timeout: 10_000,
    });
    // The project name we entered should appear in the summary
    await expect(page.getByText('E2E Test Plan')).toBeVisible();

    // Save the plan
    const saveBtn = page.getByRole('button', { name: 'Save & Generate Configs' });
    await expect(saveBtn).toBeEnabled();
    await saveBtn.click();

    // Success page: plan saved with generated config files
    await page.waitForURL(/\/wizard\/success\?planId=/, { timeout: 20_000 });
    await expect(page.getByText('Plan saved')).toBeVisible();
    await expect(page.getByText('Generated config files')).toBeVisible();

    // At least one config file block is rendered
    await expect(page.locator('pre').first()).toBeVisible();

    // "New plan" link returns to wizard
    await expect(page.getByRole('link', { name: 'New plan' })).toBeVisible();
  });
});
