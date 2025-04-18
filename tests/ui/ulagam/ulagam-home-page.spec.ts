import { test, expect } from '@playwright/test';
import { closeAdIfPresent } from '../common/common';

test('Navigation items are present', async ({ page }) => {
  await page.goto('https://astroulagam.com.my'); // or your target URL
  
  await closeAdIfPresent(page);

  const navSelector = 'nav#MAIN_NAVIGATION_HAMBURGER_HEADER';

  const expectedTexts = [
    'HOME',
    'Contests',
    'Aattam',
    'Saravedi',
    'MY FEED',
    'VIDEOS',
    'ULAGAM HEROES',
    'LIFESTYLE',
    'தமிழ்',
    'BOLLYLAH'
  ];

  for (const text of expectedTexts) {
    await expect(page.locator(`${navSelector} >> text=${text}`)).toBeVisible();
  }
});
