import { test, expect } from '@playwright/test';
import { closeAdIfPresent } from '../common/common';
import { GEMPAK_URL } from '../common/locator.constants';

test('Check navigation texts are visible', async ({ page }) => {
  await page.goto(GEMPAK_URL);

  await closeAdIfPresent(page);

  const navSelector = 'nav[aria-label="navigation bar"]';

  const expectedTexts = [
    'Utama',
    'Video',
    'Rancangan',
    'Gempak Most Wanted',
    'Salam Muslim',
    'Zon Lawak',
    'Peraduan',
    'Rojak Daily'
  ];

  for (const text of expectedTexts) {
    await expect(page.locator(`${navSelector} >> text="${text}"`).first()).toBeVisible();
  }
});
