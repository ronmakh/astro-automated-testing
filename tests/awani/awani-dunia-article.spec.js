import { test, expect } from '@playwright/test';

test('Go to Dunia news article', async ({ page }) => {
  // Navigate to the login page
  await page.goto('https://www.astroawani.com');

  // Locate the <a> element with aria-label="VIDEO"
  const duniaLink = page.locator('a[aria-label="DUNIA"]');

  // Wait for the <a> element with aria-label="DUNIA" to be visible
  await page.waitForSelector('a[aria-label="DUNIA"]', { state: 'visible' });

  // Check if the element is visible
  await expect(duniaLink).toBeVisible();

  // Click the element
  await duniaLink.click();
  
  // Locate the first child div with itemtype="http://schema.org/NewsArticle"
  const firstNewsArticle = page.locator('div[itemtype="http://schema.org/NewsArticle"]').first();

  const firstNewsLink = page.locator('div[itemtype="http://schema.org/NewsArticle"] a').first();
  await expect(firstNewsLink).toBeVisible();
  await firstNewsLink.click();

  const article = page.locator('div.article-details-wrapper');

  // Optionally, wait for navigation or assert the new page
  await expect(article).toBeVisible();
});