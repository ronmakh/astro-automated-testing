import { test, expect } from '@playwright/test';
import { closeAdIfPresent } from '../common/common';
import {STADIUM_ASTRO_URL} from '../common/locator.constants';

test('Navigation items are present', async ({ page }) => {
  await page.goto(STADIUM_ASTRO_URL);
  
  await closeAdIfPresent(page);

  const navSelector = 'nav#MAIN_NAVIGATION_HAMBURGER_HEADER';

  const expectedTexts = [
    'Live Scores',
    'Fantasy',
    'Video',
    'Bola Sepak',
    'Badminton',
    'STL',
    'Sukan Lain',
    'Lagi',
  ];

  for (const text of expectedTexts) {
    await expect(page.locator(`${navSelector} >> text=${text}`).first()).toBeVisible();
  }
});
