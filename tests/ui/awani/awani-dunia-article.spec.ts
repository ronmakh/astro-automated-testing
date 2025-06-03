import { test, expect, Page } from '@playwright/test';
import { closeAdIfPresent } from '../common/common';
import { AWANI_URL } from '../common/locator.constants';

test('Go to Dunia news article', async ({ page }) => {
  await page.goto(AWANI_URL);

  await closeAdIfPresent(page);

  const duniaLink = page.locator('a[aria-label="DUNIA"]');
  await duniaLink.waitFor({ state: 'visible' });
  await expect(duniaLink).toBeVisible();

  await closeAdIfPresent(page);
  await duniaLink.click();

  const firstNewsLink = page.locator('div[itemtype="http://schema.org/NewsArticle"] a').first();
  await expect(firstNewsLink).toBeVisible();

  await closeAdIfPresent(page);
  await firstNewsLink.click();

  const article = page.locator('div.article-details-wrapper');
  await expect(article).toBeVisible();
  await closeAdIfPresent(page);
});