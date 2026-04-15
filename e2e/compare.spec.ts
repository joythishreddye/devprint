import { test, expect } from '@playwright/test';

test.describe('Compare technologies page', () => {
  test('shows empty-state prompt when no technologies are selected', async ({ page }) => {
    await page.goto('/compare');

    await expect(page.getByRole('heading', { name: 'Compare Technologies' })).toBeVisible();
    await expect(
      page.getByText('Select two technologies above to start comparing.')
    ).toBeVisible();
  });

  test('compares two technologies via URL params', async ({ page }) => {
    await page.goto('/compare?a=react&b=svelte');

    // Both tech cards should appear with scores
    await expect(page.getByRole('heading', { name: 'React' })).toBeVisible({ timeout: 10_000 });
    await expect(page.getByRole('heading', { name: 'Svelte' })).toBeVisible();

    // Category scores section
    await expect(page.getByText('Category Scores')).toBeVisible();

    // Analysis section
    await expect(page.getByText('Analysis')).toBeVisible();

    // One card is labelled "Winner"
    await expect(page.getByText('Winner')).toBeVisible();
  });

  test('shows validation error when the same technology is selected twice', async ({ page }) => {
    await page.goto('/compare?a=react&b=react');

    await expect(
      page.getByText('Please select two different technologies')
    ).toBeVisible({ timeout: 10_000 });
  });

  test('shows a score out of 10 for each technology', async ({ page }) => {
    await page.goto('/compare?a=nextjs&b=react');

    // Scores are rendered as "X.X/10"
    const scoreLocator = page.locator('text=/\\d+\\.\\d+\\/10/').first();
    await expect(scoreLocator).toBeVisible({ timeout: 10_000 });
  });

  test('try-links on the empty state navigate to valid comparisons', async ({ page }) => {
    await page.goto('/compare');

    // The first example link e.g. "React vs Svelte"
    const firstLink = page.locator('a[href^="/compare?a="]').first();
    await expect(firstLink).toBeVisible();
    await firstLink.click();

    // Should load a comparison with results
    await page.waitForURL(/\/compare\?a=.+&b=.+/, { timeout: 10_000 });
    await expect(page.getByText('Category Scores')).toBeVisible({ timeout: 10_000 });
  });
});
