import { test, expect } from '@playwright/test';
import { closeAdIfPresent } from '../common/common';

test('Check navigation texts are visible', async ({ page }) => {
  await page.goto('https://gempak.com/');

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
    await expect(page.locator(`${navSelector} >> text="${text}"`)).toBeVisible();
  }
});
