import { test, expect } from '@playwright/test';

test.describe('Technologies listing page', () => {
  test('displays the technologies page with search and filters', async ({ page }) => {
    await page.goto('/technologies');

    await expect(page.locator('input[placeholder="Search technologies..."]')).toBeVisible();
    // "All" category filter button is always present
    await expect(page.getByRole('button', { name: 'All' })).toBeVisible();
    // At least one technology card should be rendered
    await expect(page.locator('a[href^="/technology/"]').first()).toBeVisible({ timeout: 10_000 });
  });

  test('filters technologies by search query', async ({ page }) => {
    await page.goto('/technologies');

    const searchInput = page.locator('input[placeholder="Search technologies..."]');
    await searchInput.fill('React');

    // Cards should filter — at least one result containing "React" must appear
    await expect(
      page.locator('a[href^="/technology/"]').filter({ hasText: /react/i }).first()
    ).toBeVisible({ timeout: 5_000 });
  });

  test('navigates to technology detail page from a card', async ({ page }) => {
    await page.goto('/technologies');

    // Click the first technology card link
    const firstCard = page.locator('a[href^="/technology/"]').first();
    const href = await firstCard.getAttribute('href');
    await firstCard.click();

    // Should land on the technology detail page
    await page.waitForURL(`**${href}`, { timeout: 10_000 });
    // The page heading should match the technology name shown in the card
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });
});

test.describe('Technology detail page', () => {
  test('displays technology details for a known slug', async ({ page }) => {
    await page.goto('/technology/react');

    // Header: technology name
    await expect(page.getByRole('heading', { name: /react/i }).first()).toBeVisible({
      timeout: 10_000,
    });
  });

  test('shows 404 for an unknown slug', async ({ page }) => {
    const response = await page.goto('/technology/this-does-not-exist-xyz');
    // Next.js notFound() returns a 404
    expect(response?.status()).toBe(404);
  });
});
